import { Injectable } from "@angular/core";
import { AttachmentMessage, AttachmentType, Message, MessageStream, MessageType, SendFileResponse, TextMessage } from "./message-stream.models";
import { Friend } from "../models/friend";
import { BehaviorSubject, Subject } from "rxjs";
import { AuthService } from "../login/auth.service";
import { BaseService } from "../base-service";
import { PeopleListService } from "../people-list/people-list.service";
import { UserApi } from "../api/user-api";


/**
 * Stream Service for messages
 *
 * @author Ulhas Pai
 */
@Injectable({
    providedIn: 'root'
})
export class MessageStreamService extends BaseService {

    // map of userId to stream
    messageStreams: Map<string, MessageStream>;
    currentMessageStream: MessageStream = null;

    // the current friend the user is chatting with
    currentFriend: Friend = null;
    currentFriendSubject$: Subject<Friend> = new BehaviorSubject<Friend>(null);

    // message stream updated subject
    messageStreamUpdatedSubject$: Subject<boolean> = new BehaviorSubject(null);

    constructor(private auth: AuthService,
                private peoples: PeopleListService) {
        super(auth);
        this.messageStreams = new Map()
    }

    async refreshStream() : Promise<Message<any>[]> {
        const to = new Date();
        const from = new Date(to.getTime() - 86400000);
        const messages = await UserApi.getMessages(this.auth0User.token, this.currentFriend.user.userId, from, to)
        // console.log("Messages:::", messages);
        this.addMessagesToMessageStream(this.currentFriend.user.userId, messages);
        return Promise.resolve(messages);
    }

    async sendTextMessage(text: string) : Promise<boolean> {
        const message: TextMessage = {
            type: MessageType.TEXT,
            content: text,
            senderUserId: this.auth.currentAuth0User.sub,
            receiverUserId: this.currentFriend.user.userId,
            timestamp: new Date().toISOString()
        };

        const sentMessage = await UserApi.sendTextMessage(this.auth0User.token, message)
        message.sent = true
        this.addMessageToMessageStream(this.currentFriend.user.userId, sentMessage)

        return Promise.resolve(true);
    }

    async sendFile(text: string, file: File): Promise<boolean> {
        const message: AttachmentMessage = {
            type: MessageType.ATTACHMENT,
            content: "",
            file: {
                type: AttachmentType.IMAGE,
                name: file.name,
                url: ""
            },
            senderUserId: this.auth.currentAuth0User.sub,
            receiverUserId: this.currentFriend.user.userId,
            timestamp: new Date().toISOString()
        }
        const response : SendFileResponse = await UserApi.sendAttachmentMessage(this.auth.currentAuth0User.token, message);
        response.message.sent = true
        await UserApi.uploadFile(response.uploadUrl, file)

        this.addMessageToMessageStream(this.currentFriend.user.userId, response.message)
        return Promise.resolve(true);
    }

    private addMessageToMessageStream<S extends Message<any>>(userId: string, message: S) {
        let stream = this.getOrCreateCurrentStream(userId);
        stream.messages.push(message)
        this.messageStreamUpdatedSubject$.next(true);
    }

    private addMessagesToMessageStream<S extends Message<any>>(userId: string, messages: S[]) {
        let stream = this.getOrCreateCurrentStream(userId);
        stream.messages.splice(0, stream.messages.length);
        messages.forEach(message => stream.messages.push(message))
        this.messageStreamUpdatedSubject$.next(true)
    }

    private getOrCreateCurrentStream(userId: string): MessageStream {
        let stream = this.messageStreams.get(userId);
        if (!stream) {
            stream = {
                messages: []
            };
            this.messageStreams.set(userId, stream)
        }
        return stream;
    }

    chatWithFriend(friend: Friend): void {
        this.currentFriend = friend;
        this.currentMessageStream = this.getOrCreateCurrentStream(friend.user.userId);
        this.currentFriendSubject$.next(friend);
        this.refreshStream();
    }

}
