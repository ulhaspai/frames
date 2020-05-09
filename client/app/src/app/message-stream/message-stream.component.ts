import { Component, Input, OnInit } from '@angular/core';
import { MessageStreamService } from "./message-stream.service";
import { Observable } from "rxjs";
import { Auth0User } from "../models/auth-user";
import { AuthService } from "../login/auth.service";
import { Friend } from "../models/friend";

@Component({
    selector: 'app-message-stream',
    templateUrl: './message-stream.component.html',
    styleUrls: ['./message-stream.component.scss']
})
export class MessageStreamComponent implements OnInit {

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
                public messageStreamService: MessageStreamService) {
    }

    ngOnInit(): void {
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

}
