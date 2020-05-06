import { Component, OnInit } from '@angular/core';
import { Friend } from "../models/friend";
import { from, Observable } from "rxjs";
import { AuthService } from "../login/auth.service";
import { Auth0User } from "../models/auth-user";
import { UserApi } from "../api/user-api";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'app-people-list',
    templateUrl: './people-list.component.html',
    styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit {

    private auth0User$: Observable<Auth0User>;
    private auth0User: Auth0User;
    friends$: Observable<Friend[]>;
    refreshing: boolean = false;
    addingFriends: {[key:string]: boolean} = {}

    constructor(public auth: AuthService,
                private _snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.auth0User$ = this.auth.getUser();
        this.auth0User$.subscribe(next => {
            this.auth0User = next
        });
        this.getFriends()
    }

    getFriends() {
        this.refreshing = true
        if (this.auth0User) {
            this.getFriendsInternal()
        } else {
            this.auth0User$.subscribe(user => {
                this.getFriendsInternal()
            })
        }
    }

    private getFriendsInternal() {
        this.friends$ = from(UserApi.getFriends(this.auth0User.token)
            .then((resolve) => {
                this.refreshing = false;
                return resolve
            } ))
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
            duration: 2000,
        });
    }

    isDisabled(friend: Friend) {
        return false // this.addingFriends[friend.user.userId]
    }


}
