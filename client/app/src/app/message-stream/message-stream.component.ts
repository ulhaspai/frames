import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MessageStreamService } from "./message-stream.service";
import { Observable } from "rxjs";
import { Auth0User } from "../models/auth-user";
import { AuthService } from "../login/auth.service";
import { PeopleListService } from "../people-list/people-list.service";
import { AttachmentMessage, Message, MessageType } from "./message-stream.models";

@Component({
    selector: 'app-message-stream',
    templateUrl: './message-stream.component.html',
    styleUrls: ['./message-stream.component.scss']
})
export class MessageStreamComponent implements OnInit {

    @ViewChild('messageStreamBody') private scrollContainer: ElementRef;

    private auth0User$: Observable<Auth0User>;
    public auth0User: Auth0User;

    private dateFormat = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    }

    private timeFormat = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    }
    @Input("userId")
    userId: string;

    constructor(public auth: AuthService,
                public messageStreamService: MessageStreamService,
                public peopleList: PeopleListService) {
    }

    ngOnInit(): void {
        this.messageStreamService.messageStreamUpdatedSubject$.subscribe(next => {
            if(next) {
                this.scrollToBottom();
            }
        });

        this.auth0User$ = this.auth.getUser();
        this.auth0User$.subscribe(next => {
            this.auth0User = next
        });

    }

    formatDate(isoDate: string): string {
        const date = new Date(isoDate);
        let string = new Intl.DateTimeFormat('default', this.dateFormat).format(date);
        string += " " + new Intl.DateTimeFormat('default', this.timeFormat).format(date);
        return string;
    }

    getFriendEmail(id: string): string {
        if (id === this.auth.currentAuth0User.sub) {
            return this.auth.currentAuth0User.email;
        } else {
            const friend = this.messageStreamService.currentFriend;
            return friend && friend.user ? friend.user.email : id;
        }
    }

    scrollToBottom(): void {
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }

    isAttachment(message: Message<string>): boolean {
        return message.type === MessageType.ATTACHMENT
    }

    getFileUrl(message: any): string {
        return message && message.file ? message.file.url : '';
    }

}
