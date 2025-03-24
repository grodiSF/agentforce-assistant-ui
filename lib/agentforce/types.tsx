export enum RequestMessageType{
    Text = 'Text',
    Reply =  'Reply',
    Cancel = 'Cancel',
    TransferFailed = 'TransferFailed',
    TransferSucceeded = 'TransferSucceeded',
    PlanTemplate = 'PlanTemplate'
};
export enum ResponseMessageType{
    Inform = 'Inform',
    TextChunk = 'TextChunk',
    ValidationFailureChunk = 'ValidationFailureChunk',
    ProgressIndicator = 'ProgressIndicator',
    Inquire = 'Inquire',
    Confirm = 'Confirm',
    Failure = 'Failure',
    Escalate = 'Escalate',
    SessionEnded = 'SessionEnded',
    EndOfTurn = 'EndOfTurn',
    Error = 'Error',
}

export enum VariableType{
    Object = 'Object',
    Json = 'Json',
    Boolean = 'Boolean',
    Date = 'Date',
    DateTime = 'DateTime',
    Money = 'Money',
    Number = 'Number',
    Text = 'Text',
    Ref = 'Ref',
    List = 'List',
}

export enum ChunkType{
    Text = 'Text'
}

export enum CitedReferenceType{
    record = 'record',
    link = 'link'
}

export enum EndSessionReason{
    UserRequest = 'UserRequest',
    Transfer = 'Transfer',
    Expiration = 'Expiration',
    Error = 'Error',
    Other = 'Other'
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AEscalateMessage */
export enum EscalateMessageTargetType{
    'Salesforce:Core:Bot:Id',
    'Salesforce:Core:Queue:Id',
    'Salesforce:Core:Skill:Id',
    'Salesforce:Core:Flow:Id'
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AEventType */
export enum EventType{
    UNKNOWN = 'UNKNOWN',
    END_OF_TURN = 'END_OF_TURN',
    PROGRESS_INDICATOR = 'PROGRESS_INDICATOR',
    INFORM = 'INFORM',
    INQUIRE = 'INQUIRE',
    CONFIRM = 'CONFIRM',
    FAILURE = 'FAILURE',
    SESSION_ENDED = 'SESSION_ENDED',
    ERROR = 'ERROR',
    ESCALATE = 'ESCALATE',
    TEXT_CHUNK = 'TEXT_CHUNK'
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AFailureMessage */
export enum FailureMessageCode{
    ACTION_FAILED = 'ACTION_FAILED',
    ESCALATE = 'ESCALATE'
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AFeedbackRating */
export enum FeedbackRating{
    GOOD = 'GOOD',
    BAD = 'BAD'
}

/** The rendering format of a message. Describes how the message looks. */
// @TODO
export enum FormatType{
    MessageDefinition = 'MessageDefinition',
    Text = 'Text'
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AFormatTypeCapability */
// @TODO
export enum FormatTypeCapability{
    MessageDefinition = 'MessageDefinition',
    Text = 'Text'
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AMessageType */
// @TODO
export enum MessageType{
    ChoicesMessage = 'ChoicesMessage'
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AMessageTypeCapability */
// @TODO
export enum MessageTypeCapability{
    ChoicesMessage = 'ChoicesMessage'
}

export enum ProgressIndicatorType{
    ACTION = 'ACTION'
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AReferrer */
export enum ReferrerType{
    'Salesforce:Core:Bot:Id',
    'Salesforce:BotRuntime:Session:Id'
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ASessionEndedMessage */
export enum SessionEndedMessageReason{
    ClientRequest = 'ClientRequest',
    TransferFailedNotConfigured = 'TransferFailedNotConfigured',
    Action = 'Action',
    Error = 'ERROR',
    InfiniteLoopDetected = 'InfiniteLoopDetected'
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ASessionFeature */
export enum SessionFeature{
    Sync = 'Sync',
    Streaming = 'Streaming'
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AStatus */
export enum Status{
    UP = 'UP',
    DOWN = 'DOWN'
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ATextFormatType */
export enum MessageFormatType{
    Unknown = 'Unknown',
    Text = 'Text'
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ATransferFailedMessage */
export enum TransferFailedType{
    NoAgentAvailable = 'NoAgentAvailable',
    Error = 'Error'
}

// ****************** REQUESTS

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AStartSessionRequest */
export interface StartSessionRequest{
    /** UUID that you provide for the conversation. You can use this parameter to trace the conversation in your agent's event logs. */
    externalSessionKey: string;
    /** API configuration parameters. */
    instanceConfig: InstanceConfig;
    /** Client timezone where the customer starts the chat. Uses the tz database timezone format. Can be null. */
    tz: string;
    /** Array of custom and context agent variables passed to the agent during a session. */
    variables: Variables;
    /** Defines how the session supports message processing. */
    featureSupport: SessionFeature;
    /** Describes the streaming capabilities. */
    streamingCapabilities: StreamingCapability;
    /** Indicates whether to use the agent-assigned user instead of the logged in user. Defaults to false. Current guidance is to set this to true. */
    bypassUser: boolean;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ASendMessageRequest */
export interface SendMessageRequest{
    /** Represents the message to be sent. */
    message: TextMessage | ReplyMessage | CancelMessage | TransferFailedMessage | TransferSucceededMessage | PlanTemplateMessage;
    /** Array of custom and context agent variables passed to the agent during a session. */
    variables: Variables;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AAbstractRequestMessage */
export interface AbstractRequestMessage{
    /** Represents the message to be sent. */
    type: RequestMessageType;
    /** Client-generated sequence number of the message in a session. Increase this number for each subsequent message. */
    sequenceId: number;
}


/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ATextMessage */
export interface TextMessage extends AbstractRequestMessage{
    /** Indicates the type of message.  */
    type: RequestMessageType.Text;
    /** Message ID of the previous response you are replying to. */
    inReplyToMessageId: string;
    /** Text reply to the agent. */
    text: string;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AReplyMessage */
export interface ReplyMessage extends AbstractRequestMessage{
    /** Request message type. */
    type: RequestMessageType.Reply;
    /** Message ID of the previous response you are replying to. */
    inReplyToMessageId: string;
    reply: TypePropertyValue[];
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ACancelMessage */
export interface CancelMessage extends AbstractRequestMessage{
    /** Represents the message to be sent. */
    type: RequestMessageType.Cancel;
    /** Message ID of the previous response you are replying to. */
    inReplyToMessageId: string;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ATransferFailedMessage */
export interface TransferFailedMessage extends AbstractRequestMessage{
    /** Request message type.  */
    type: RequestMessageType.TransferFailed;
    /** Message ID of the previous response you are replying to. */
    inReplyToMessageId: string;
    /** Reason for the failed transfer. */
    reason: TransferFailedType;
    /** Description of why the transfer failed. */
    description: string;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ATransferSucceededMessage */
export interface TransferSucceededMessage extends AbstractRequestMessage{
    /** Request message type.  */
    type: RequestMessageType.TransferSucceeded;
    /** Message ID of the previous response you are replying to. */
    inReplyToMessageId: string;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3APlanTemplateMessage */
export interface PlanTemplateMessage extends AbstractRequestMessage{
    /** Request message type */
    type: RequestMessageType.PlanTemplate;
    /** Message ID of the previous response you are replying to.*/
    inReplyToMessageId: string;
    /** Represents details of plan to be executed. Plan templates are metadata and available to planner service. */
    details: PlanTemplateMessageDetail;
}

// ****************** RESPONSES

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AStartSessionSyncResponseMessage */
export interface StartSessionSyncResponseMessage{
    /** UUID that references this message. */
    sessionId: string;
    /** List of Agentforce endpoints for HATEOS compliance. */
    _links: SyncLinks;
    /** Array of initial messages */
    messages: AbstractResponseMessage[];
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AAbstractResponseMessage */
export interface AbstractResponseMessage{
    /** UUID that references this message. */
    id: string;
    /** Indicates the type of message. */
    type: ResponseMessageType;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AInformMessage */
export interface InformMessage extends AbstractResponseMessage{
    /** Indicates the type of message. */
    type: ResponseMessageType.Inform;
    /** Unique ID to identify the generation. Used to submit feedback. */
    feedbackId: string;
    /** Unique ID to identify the plan. */
    planId: string;
    /** Indicates whether the content is deemed as safe. A false value doesn't necessarily mean that the content isn't toxic. */
    isContentSafe: boolean;
    /** the message */
    message: string;
    /** Array of results. */
    result: TypePropertyValue[];
    /** Array of citations. */
    citedReferences: CitedReference[];
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ATextChunkMessage */
export interface TextChunkMessage extends AbstractResponseMessage{

    /** Indicates the type of message.  */
    type: ResponseMessageType.TextChunk;
    /** Offset value. */
    offset: number;
    /** Text chunk message. */
    message: string;
    /** The text format type. */
    formatType: MessageFormatType;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AValidationFailureChunkMessage */
export interface ValidationFailureChunkMessage extends AbstractResponseMessage{
    /** Indicates the type of message.  */
    type: ResponseMessageType.ValidationFailureChunk;
    /** Offset value. */
    offset: number;
    /** Reason for validation failure. */
    reason:string;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AProgressIndicatorMessage */
export interface ProgressIndicatorMessage extends AbstractResponseMessage{
    /** Indicates the type of message. */
    type: ResponseMessageType.ProgressIndicator;
    /** Indicates the type of progress indicator. */
    indicatorType: ProgressIndicatorType;
    /** Status message sent to the user.*/
    message: string;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AInquireMessage */
export interface InquireMessage extends AbstractResponseMessage{
    /** Indicates the type of message. */
    type: ResponseMessageType.Inquire;
    /** Unique ID to identify the generation. Used to submit feedback. */
    feedbackId: string;
    /** Unique ID to identify the plan. */
    planId: string;
    /** Indicates whether the content is deemed as safe. A false value doesn't necessarily mean that the content isn't toxic. */
    isContentSafe: boolean;
    /** the message */
    message: string;
    /** List of data to be collected. */
    collect: InquireCollectMessage[];
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AConfirmMessage */
export interface ConfirmMessage extends AbstractResponseMessage{
    /** Indicates the type of message. Can be one of the following strings: Inform, TextChunk, ValidationFailureChunk, ProgressIndicator, Inquire, Confirm, Failure, Escalate, SessionEnded, EndOfTurn, Error. */
    type: ResponseMessageType.Confirm;
    /** Unique ID to identify the generation. Used to submit feedback. */
    feedbackId: string;
    /** Unique ID to identify the plan. */
    planId: string;
    /** Indicates whether the content is deemed as safe. A false value doesn't necessarily mean that the content isn't toxic. */
    isContentSafe: boolean;
    /** the message */
    message: string;
    /** List of data to be collected. */
    confirm: TypePropertyValue[];
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AFailureMessage */
export interface FailureMessage extends AbstractResponseMessage{
    /** Indicates the type of message. */
    type: ResponseMessageType.Failure;
    /** Unique ID to identify the generation. Used to submit feedback. */
    feedbackId: string;
    /** the message */
    message: string;
    /** Unique ID to identify the plan. */
    planId: string;
    /** Indicates whether the content is deemed as safe. A false value doesn't necessarily mean that the content isn't toxic. */
    isContentSafe: boolean;
    code: FailureMessageCode
    /** Failure information. */
    errors: string[];

}

/** 
 * Indicates that a human agent should handle this request.
 * https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AEscalateMessage
 */
export interface EscalateMessage extends AbstractResponseMessage{
    /** Indicates the type of message. */
    type: ResponseMessageType.Error;
    /** Unique ID to identify the generation. Used to submit feedback. */
    feedbackId: string;
    /** Array of transfer targets. */
    targets: EscalateMessageTarget[];
}

export interface SessionEndedMessage extends AbstractResponseMessage{
    /** Indicates the type of message. Can be one of the following strings */
    type: ResponseMessageType.SessionEnded;
    /** Reason the session ended. */
    reason: SessionEndedMessageReason;
    feedbackId: string;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AEndOfTurnMessage */
export interface EndOfTurnMessage extends AbstractResponseMessage{
    /** Indicates the type of message. */
    type: ResponseMessageType.EndOfTurn;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AErrorMessage */
export interface ErrorMessage extends AbstractResponseMessage{
    /** Indicates the type of message. */
    type: ResponseMessageType.Error;
    /** Unique ID to identify the generation. Used to submit feedback. */
    feedbackId: string;
    /** Error HTTP status code. */
    httpStatus: number;
    /** Error trace ID. */
    traceId: string;
    /** Error class name. */
    error: string;
    /** Error message. */
    message: string;
    /** Unix timestamp. */
    timestamp: number;
    /** Indicates whether the error was expected. */
    expected: boolean;
}



// ********** Supports

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3APlanTemplateMessage */
export interface PlanTemplateMessageDetail{
    /** ID of the plan template. */
    planId: string
    /** A string representing the user intent behind this plan. */
    intent: string;
    /** User utterance that should be used in conversation history as a result of executing this plan.*/
    userUtterance: string; 
    /** Contains name value pairs capturing the variable substitutions in the plan. */
    variables: object
} 

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AReplyMessage */
export interface TypePropertyValue{
    /** The action type ID.  */
    type: string;
    /** The action property ID. */
    property: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AEscalateMessage */
export interface EscalateMessageTarget{
    /** Type of the transfer target. */
    type: EscalateMessageTargetType;
    /** ID of the transfer target. */
    value: string;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ACitedReference */
export interface InlineMetadata{
    /** Text from the agent response relevant to this reference.*/
    claim: string;
    /** Index location for where this citation should be placed. */    
    location: number;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ACitedReference */
export interface CitedReference{
    /** Type of citation. This value can be either a CRM record (record) or an external link (link). */
    type: CitedReferenceType,
    /** Record ID or external link address. */
    value: string 
    /** Inline metadata information.*/
    inlineMetadata: InlineMetadata[];
}

/** 
 * https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AInquireCollectMessage
 * https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AInquireMessage
*/
export interface InquireCollectMessage{
    /** The action type ID */
    targetType: string;
    /** The action property ID */
    targetProperty: string;
    /** Bundle for a source type. */
    data: TypePropertyValue;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AInstanceConfig */
export interface InstanceConfig{
    /** My Domain URL for your Salesforce org. From Setup, search for My Domain. Copy the value shown in the Current My Domain URL field. */
    endpoint: string;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AVariable */
export interface Variable {
    name: string;
    type: VariableType;
    value: string | boolean | object | number;
}

export type Variables = Variable[];

export interface BooleanVariable extends Variable{
    name: string;
    type: VariableType.Boolean;
    value: boolean;
}

export interface DateTimeVariable extends Variable{
    /** Variable name. */
    name: string;
    /** Variable type. */
    type: VariableType.DateTime;
    /** @example 2018-09-21T14:30:00 */
    value: string;
}

export interface DateVariable extends Variable{
    /** Variable name. */
    name: string;
    /** * Variable type. */
    type: VariableType.Date;
    /** @example 2018-09-21 */
    value: string;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AJsonVariable */
export interface JsonVariable extends Variable{
    /** Variable name. */
    name: string;
    /** * Variable type. */
    type: VariableType.Json;
    value: object;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AListVariable */
export interface ListVariable extends Variable{
    /** Variable name. */
    name: string;
    /** * Variable type. */
    type: VariableType.List;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AMoneyVariable */
export interface MoneyVariable extends Variable{
    /** Variable name. */
    name: string;
    /** * Variable type. */
    type: VariableType.Money;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: string;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ATypeValue */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypeValue = any;

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ANumberVariable */
export interface NumberVariable extends Variable{
    /** Variable name. */
    name: string;
    /** * Variable type. */
    type: VariableType.Number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: number;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AObjectVariable */
export interface ObjectVariable extends Variable{
    /** Variable name. */
    name: string;
    /** * Variable type. */
    type: VariableType.Object;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: object;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ARefVariable */
export interface RefVariable extends Variable{
    /** Variable name. */
    name: string;
    /** * Variable type. */
    type: VariableType.Ref;
    value: string;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ATextVariable */
export interface TextVariable extends Variable{
    /** Variable name. */
    name: string;
    /** * Variable type. */
    type: VariableType.Text;
    value: string;
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3AStreamingCapability */
export interface StreamingCapability{
    chunkTypes: ChunkType[];
}

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ASendMessagesSyncResponseMessage */
export interface Link{
    /** Link to the endpoint. */
    href: string;
} 

/** https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=type%3ASendMessagesSyncResponseMessage */
export interface SyncLinks{
    /** Hyperlink object included in the links schema. */
    self: Link;
    /** Hyperlink object included in the links schema.*/
    messages: Link;
    /** Hyperlink object included in the links schema. */
    session: Link;
    /** Hyperlink object included in the links schema. */
    end: Link;
}

export interface Response{
    messages: AbstractResponseMessage[];
    _links : SyncLinks; 
}