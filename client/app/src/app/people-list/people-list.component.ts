import { Component, OnInit } from '@angular/core';
import { Friend } from "../models/friend";
import { from, Observable } from "rxjs";
import { AuthService } from "../login/auth.service";
import { Auth0User } from "../models/auth-user";
import { UserApi } from "../api/user-api";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MessageStreamService } from "../message-stream/message-stream.service";
import { PeopleListService } from "./people-list.service";

@Component({
    selector: 'app-people-list',
    templateUrl: './people-list.component.html',
    styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit {

    private auth0User$: Observable<Auth0User>;
    private auth0User: Auth0User;
    addingFriends: {[key:string]: boolean} = {}

    constructor(public auth: AuthService,
                public messageStreamService: MessageStreamService,
                public peoples: PeopleListService,
                private _snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.auth0User$ = this.auth.getUser();
        this.auth0User$.subscribe(next => {
            this.auth0User = next
        });
    }

    async addFriend(option: Friend) {
        console.log("Adding friend: ", option);
        this.addingFriends[option.user.userId] = true
        const added = await UserApi.addFriend(this.auth0User.token, option.user.userId)
        this.addingFriends[option.user.userId] = false
        if (!!added) {
            option.friendship.accepted = true
        }
        this._snackBar.open("Added Friend: " + option.user.email, null, {
            duration: 3000,
        });
    }

    isDisabled(friend: Friend) {
        return false // this.addingFriends[friend.user.userId]
    }

    selectFriend(friend: Friend): void {
        this.messageStreamService.chatWithFriend(friend)
    }

}
