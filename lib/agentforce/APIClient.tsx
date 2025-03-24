
import * as AFTypes from './types';
import {createParser, type EventSourceMessage} from 'eventsource-parser'
import moment from 'moment';
import { v7 as uuidv7 } from 'uuid';


/** ✅ Type Definitions */
export interface ClientConfig {
    domain: string;
    authUrl: string;
    apiBaseUrl: string;
    agentId: string;
    clientId: string;
    clientSecret: string;
    corsProxyUrl?: string;
    product?:string;
}

interface AuthContext{
    accessToken: null | string;
    apiInstanceUrl: null | string;
    tokenExpiry: null | number;
    agentSession: null | AFTypes.StartSessionSyncResponseMessage
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function* streamAsyncIterator(stream: ReadableStream<Uint8Array<ArrayBufferLike>>) {
    // Get a lock on the stream
    const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
  
    try {
      while (true) {
        // Read from the stream
        const { done, value } = await reader.read();
        // Exit if we're done
        if (done) return;
        // Else yield the chunk
        yield value;
      }
    } finally {
      reader.releaseLock();
    }
}


export default class AgentforceApiClient {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    #authInfo: AuthContext = {
        accessToken: null, 
        apiInstanceUrl: null, 
        tokenExpiry: null, 
        agentSession: null
    }

    #clientConfig: ClientConfig = null as any;


    async initialize(clientConfig: ClientConfig){
        console.log('', '<initialize>');
        this.#clientConfig = clientConfig;
        await this.#ensureSession(' ');
        console.log('', '</initialize>');
    }

    #addProduct = (variables: AFTypes.Variables) => {
        if(this.#clientConfig.product){
            variables.push({
                name: '$Context.Product',
                type: AFTypes.VariableType.Text,
                value: this.#clientConfig.product
            } as AFTypes.TextVariable);
        }
    }


    /**
     * Authenticate with Salesforce
     * @returns {Promise<void>} Promise that resolves once the client is authenticated
     */
    async #authenticate(debugIntend: string = ''): Promise<void>{
        console.log(debugIntend, '<authenticate/>');
        try {
            console.log(debugIntend+ ' ', `🔑 Using ${this.#clientConfig.domain + this.#clientConfig.authUrl} url to obtain a token`);

            const response: Response = await fetch(this.#clientConfig.domain + this.#clientConfig.authUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: this.#clientConfig.clientId,
                    client_secret: this.#clientConfig.clientSecret,
                }),
            });

            if (!response.ok) {
                const body = await response.text();
                throw new Error(
                    `Auth failed: ${response.status}\nResponse body: ${body}`
                );
            }

            const data: { access_token: string; expires_in: number; api_instance_url: string } = await response.json();
        
            this.#authInfo.accessToken = data.access_token;
            this.#authInfo.apiInstanceUrl = data.api_instance_url;
            this.#authInfo.tokenExpiry = moment(Date.now()).add(28, 'm').toDate().getTime()
            
            console.log(debugIntend + ' ', `🔑 Salesforce token obtained on ${this.#clientConfig.domain}! (API endpoint: ${this.#authInfo.apiInstanceUrl})`);
            
        } catch (error) {
            console.error(debugIntend + ' ', "❌ Salesforce authentication failed:", error);
            throw new Error("Failed to authenticate with Salesforce", {
                cause: error
            });
        }
    }

    /** Ensures the Salesforce token is valid */
    async #ensureAuth(debugIntend: string = ''): Promise<void> {
        console.log(debugIntend, '<ensureAuth>');
        if (!this.#authInfo?.accessToken || (this.#authInfo?.tokenExpiry && Date.now() >= this.#authInfo?.tokenExpiry)) {
            console.log(debugIntend + ' ', '<notAuthenticated>');
            await this.#authenticate(debugIntend + '  ');
            console.log(debugIntend + ' ', '</notAuthenticated>');
        }else{
            console.log(debugIntend + ' ', '<alreadyAuthenticated/>');
        }    
        console.log(debugIntend, '</ensureAuth>');
    };

    /** Creates a new chat session */
    async #createSession(debugIntend:string = ''): Promise<void> {
        console.log(debugIntend,'<createSession>');
        await this.#ensureAuth(debugIntend + ' ');
        try {
            console.log(debugIntend + ' ', `Using ${this.#clientConfig.apiBaseUrl}/einstein/ai-agent/v1/agents/${this.#clientConfig.agentId}/sessions url to generate session`);
            const startSessionReq: AFTypes.StartSessionRequest = {
                externalSessionKey: uuidv7(),
                instanceConfig: {
                    endpoint: this.#clientConfig.domain
                },
                tz: 'Europe/Berlin',
                variables: [
                    {
                        name: '$Context.EndUserLanguage',
                        type: AFTypes.VariableType.Text,
                        value: 'de_DE'
                    } as AFTypes.TextVariable
                ],
                featureSupport: AFTypes.SessionFeature.Streaming,
                streamingCapabilities: {
                    chunkTypes: [
                        AFTypes.ChunkType.Text
                    ]
                },
                bypassUser: true
            }
            this.#addProduct(startSessionReq.variables);
            const response = await fetch(`${this.#clientConfig.corsProxyUrl}/${this.#clientConfig.apiBaseUrl}/einstein/ai-agent/v1/agents/${this.#clientConfig.agentId}/sessions`, 
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${this.#authInfo.accessToken}`,
                        'Content-Type': 'application/json',
                        'x-requested-with': this.#clientConfig.domain,
                        'x-replace-origin-with': this.#clientConfig.domain,
                    },
                    body: JSON.stringify( startSessionReq )
                }
            );

            if (!response.ok) {
                const body = await response.text();
                throw new Error(
                    `Agent session creation failed: ${response.status}\nResponse body: ${body}`
                );
            }

            this.#authInfo.agentSession = await response.json();

            if (!this.#authInfo.agentSession?.sessionId) throw new Error("Session ID missing in response");

            console.log(debugIntend + ' ',"✅ New agenforce chat session started:", this.#authInfo.agentSession.sessionId);
        } catch (error) {
            console.error(debugIntend+ ' ', "❌ Chat session creation failed:", error);
            throw new Error("Failed to create chat session");
        }
        console.log(debugIntend, '</createSession>');

    };

    /** Ensures a chat session exists */
    async #ensureSession(debugIndent: string = ''): Promise<void>{
        console.log(debugIndent, '<ensureSession>');
        if (!this.#authInfo.agentSession?.sessionId) {
            await this.#createSession(debugIndent + ' ');
        }
        console.log(debugIndent, '</ensureSession>');
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async sendMessageSync(message: string): Promise<any>{
        try{
            const rawResponse: Response = await this.#sendMessage(true, message);
            return await rawResponse.json();
        } catch (error) {
            console.error("❌ Error sending message:", error);
            throw new Error("Message sending failed");
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async sendMessageStream(message: string, eventCallback: (data: object, type?: string) => void){
        try{
            const onEvent = (event: EventSourceMessage) => {
                eventCallback(JSON.parse(event.data), event.event);
            };

            const agentResponse: Response = await this.#sendMessage(false, message);
            const agentResponseBody = agentResponse.body;
            if(agentResponseBody){
                const eventParser = createParser({onEvent})
                for await (const chunk of streamAsyncIterator(agentResponseBody)) {
                    eventParser.feed(chunk)
                }
                eventParser.reset()
                console.log('Done!')
            }            
        } catch (error) {
            console.error("❌ Error sending message:", error);
            throw new Error("Message sending failed");
        }
    }

    async #sendMessage(sync: boolean = true, message: string): Promise<Response>{
        await this.#ensureAuth();
        await this.#ensureSession();

        const aSyncPathSuffix = sync ? '': '/stream';

        const agentMessage: AFTypes.SendMessageRequest = {
            "message": {
                type: AFTypes.RequestMessageType.Text,
                sequenceId: Date.now(),
                text: message
            } as AFTypes.TextMessage,
            variables: []
        }

        this.#addProduct(agentMessage.variables);
        console.log(agentMessage);

        const response = await fetch(
            `${this.#clientConfig.corsProxyUrl}/${this.#clientConfig.apiBaseUrl}/einstein/ai-agent/v1/sessions/${this.#authInfo.agentSession?.sessionId}/messages${aSyncPathSuffix}`,
            {
                method: 'POST',
                headers: {
                Authorization: `Bearer ${this.#authInfo.accessToken}`,
                'Content-Type': 'application/json',
                'x-requested-with': this.#clientConfig.domain,
                'x-replace-origin-with': this.#clientConfig.domain,
                },
                body: JSON.stringify(agentMessage)
            }
        );

        if (!response.ok) {
            const body = await response.text();
            throw new Error(
                `Message send failed: ${response.status}\nResponse body: ${body}`
            );
        }

        if (!response.ok) throw new Error(`Message send failed: ${response.statusText}`);

        return response;
    }
}