import { AppendMessage, AssistantRuntimeProvider, TextContentPart, ThreadAssistantContentPart, ThreadMessageLike, useExternalStoreRuntime } from "@assistant-ui/react";
import { useContext, useState, useEffect, ReactNode } from "react";
import { ClientConfigContext, ClientConfigContextItf } from "./ClientConfigContext";
import AgentforceApiClient from "@/lib/agentforce/APIClient";
import * as AFTypes  from "@/lib/agentforce/types";


const apiClient = new AgentforceApiClient();

const convertMessage = (message: object): ThreadMessageLike => {
    let retMsg = message;
    if(!('role' in retMsg)){
        retMsg =  {
            role: 'assistant',//message.role,
            content: [{ type: "text", text: 'fallback' /*message.content*/ } ] as ThreadAssistantContentPart[]
          } ;
    }
    return retMsg as ThreadMessageLike;
  };

export function AgentforceRuntimeProvider({
    children,
}: Readonly<{
    children: ReactNode;
}>) {

    const [isRunning, setIsRunning] = useState(false);
    const [messages, setMessages] = useState<object[]>([]);
    const { clientConfig, isClientConfigSet, setIsClientConfigSet } = useContext(ClientConfigContext) as ClientConfigContextItf;

    useEffect(() => {
        const initialize = async () => {
            if(isClientConfigSet){
                try{
                    await apiClient.initialize(clientConfig);   
                }catch(e){
                    console.log(e);
                    setIsClientConfigSet(false);
                }
            }
        }
        initialize();

    }, [clientConfig, isClientConfigSet]);
      


    const onNew = async (message: AppendMessage) => {
        const input = (message.content[0] as TextContentPart).text;
            setMessages((currentConversation) => [
                ...currentConversation,
                { role: "user", content: input },
            ]);

        setIsRunning(true);
        if(false){
            const assistantMessage = await apiClient.sendMessageSync(input);
            setMessages((currentConversation) => [
                ...currentConversation,
                assistantMessage,
            ]);
        }else{
            await apiClient.sendMessageStream(input, (data: any, type?: string)=>{
                console.log('Received same event!', type, data)
                console.log(AFTypes.ResponseMessageType.ProgressIndicator.toUpperCase())
                switch (type) {
                    case AFTypes.EventType.UNKNOWN:
                        break;
                    case AFTypes.EventType.END_OF_TURN:
                        break;
                    case AFTypes.EventType.PROGRESS_INDICATOR:
                        break;
                    case AFTypes.EventType.INFORM:
                        break;
                    case AFTypes.EventType.INQUIRE:
                        break;
                    case AFTypes.EventType.CONFIRM:
                        break;
                    case AFTypes.EventType.FAILURE:
                        break;
                    case AFTypes.EventType.SESSION_ENDED:
                        break;
                    case AFTypes.EventType.ERROR:
                        break;
                    case AFTypes.EventType.ESCALATE:
                        break;
                    case AFTypes.EventType.TEXT_CHUNK:
                        const tMsg:AFTypes.TextChunkMessage = data['message'];
                        if(tMsg.offset === 0){
                            setMessages((currentConversation) => [
                                ...currentConversation,
                                { role: "assistant", content: tMsg.message },
                            ]);
                        }else{
                            setMessages((currentConversation) => {
                                const convs = [...currentConversation];
                                const lastMessage: ThreadMessageLike = convs.pop() as ThreadMessageLike;
                                return [
                                    ...convs,
                                    { role: "assistant", content: lastMessage.content + tMsg.message },
                                ]
                            });                            
                        }
                        
                        break;
                    default:
                        break;
                }
            });
        }        
        setIsRunning(false);

    };



    const runtime = useExternalStoreRuntime({
        isRunning,
        messages,
        convertMessage,
        onNew,
        // suggestions?: readonly ThreadSuggestion[] | undefined;
        // onEdit?: ((message: AppendMessage) => Promise<void>) | undefined;
        // onReload?: // TODO: remove parentId in 0.8.0 | ((parentId: string | null, config: StartRunConfig) => Promise<void>) | undefined;
        // onCancel?: (() => Promise<void>) | undefined;
        // convertMessage?: ExternalStoreMessageConverter<T> | undefined;
        /*
        adapters?:
    | {
        attachments?: AttachmentAdapter | undefined;
        speech?: SpeechSynthesisAdapter | undefined;
        feedback?:
        */

    });
    
    return (
        <AssistantRuntimeProvider runtime={runtime}>
            {children}
        </AssistantRuntimeProvider>
    );
}