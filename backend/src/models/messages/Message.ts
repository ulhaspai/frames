
export enum AttachmentType {
    TEXT,
    IMAGE,
    FILE
}

export enum MessageType {
    TEXT,
    ATTACHMENT
}

export interface Message<T> {
    id?: string;
    type: MessageType;
    content: T;
    timestamp: string;
    senderUserId: string;
    receiverUserId: string;
}

export class Attachment {
    type: AttachmentType;
    name: string;
    url: string;
}

export class TextMessage implements Message<string> {
    type = MessageType.TEXT;
    content: string;
    senderUserId: string;
    receiverUserId: string;
    timestamp: string;
}

export class AttachmentMessage implements Message<Attachment> {
    type = MessageType.ATTACHMENT;
    content: Attachment;
    senderUserId: string;
    receiverUserId: string;
    timestamp: string;
}

export class MessageStream {
    messages: Array<Message<any>>;
}
