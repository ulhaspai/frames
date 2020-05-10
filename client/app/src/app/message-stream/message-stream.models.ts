
export enum AttachmentType {
    TEXT,
    IMAGE
}

export enum MessageType {
    TEXT,
    ATTACHMENT
}

export interface Message<T> {
    type: MessageType;
    content: T;
    timestamp: string;
    senderUserId: string;
    receiverUserId: string;
    sent?: boolean;
}

export class Attachment {
    type: AttachmentType;
    name: string;
    url: string;
}

export class TextMessage implements Message<string> {
    readonly type = MessageType.TEXT;
    content: string;
    senderUserId: string;
    receiverUserId: string;
    timestamp: string;
    sent?: boolean;
}

export class AttachmentMessage implements Message<string> {
    readonly type = MessageType.ATTACHMENT;
    content: string;
    file: Attachment;
    senderUserId: string;
    receiverUserId: string;
    timestamp: string;
    sent?: boolean;
}

export class MessageStream {
    messages: Array<Message<any>>;
}

export class SendFileResponse {
    message: Message<any>;
    uploadUrl: string;
}
