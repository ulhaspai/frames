import { Injectable } from "@angular/core";
import { Message, MessageStream, MessageType } from "./message-stream.models";
import { Friend } from "../models/friend";
import { BehaviorSubject, Subject } from "rxjs";
import { AuthService } from "../login/auth.service";
import { BaseService } from "../base-service";
import { PeopleListService } from "../people-list/people-list.service";
import { FormControl } from "@angular/forms";


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

    constructor(private auth: AuthService,
                private peoples: PeopleListService) {
        super(auth);
        this.messageStreams = new Map()
    }

    refreshStream(userId: string) {

    }

    sendTextMessage(text: string) {
        this.addToMessageStream(this.currentFriend.user.userId, {
            type: MessageType.TEXT,
            content: text,
            senderUserId: this.auth.currentAuth0User.sub,
            timestamp: new Date().toISOString()
        })
    }

    private addToMessageStream<S extends Message<any>>(userId: string, message: S) {
        let stream = this.getOrCreateCurrentStream(userId);
        stream.messages.push(message)
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

        for (let i=0; i< 5; i++) {
            this.sendTextMessage("Hello, " + friend.user.email + "!");
        }
    }

}
