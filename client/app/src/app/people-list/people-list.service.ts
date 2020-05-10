import { BaseService } from "../base-service";
import { AuthService } from "../login/auth.service";
import { from, Observable } from "rxjs";
import { Friend } from "../models/friend";
import { UserApi } from "../api/user-api";
import { Injectable } from "@angular/core";

/**
 * People list service for fetching friends
 *
 * @author Ulhas Pai
 */
@Injectable({
    providedIn: 'root'
})
export class PeopleListService extends BaseService {

    friends$: Observable<Friend[]>;

    // list of all friends
    private friends: Friend[];

    // map of userId to friend
    friendMap: Map<string, Friend>;

    numInvites: number = 0;
    refreshing: boolean = false;

    constructor(auth: AuthService) {
        super(auth);
        this.friendMap = new Map();
        this.refreshFriends();
    }

    public async refreshFriends() {
        this.refreshing = true;
        this.auth0User$.subscribe(next => {
            this.friends$ = from(UserApi.getFriends(this.auth0User.token)
                .then((resolve) => {
                    this.friendMap.clear();
                    resolve.forEach(f => this.friendMap.set(f.user.userId, f));
                    this.numInvites = resolve.filter(f => !f.friendship.accepted).length;
                    this.friends = resolve;
                    this.refreshing = false;
                    return resolve;
                }))
        })
    }

    getFriends$(): Observable<Friend[]> {
        return this.friends$;
    }

    /**
     * @return a copy of the friends list
     */
    getFriends(): Friend[] {
        return JSON.parse(JSON.stringify(this.friends));
    }

    /**
     * @return a copy of friend user object for the input userId, if exists
     */
    getFriend(userId: string): Friend {
        return JSON.parse(JSON.stringify(this.friendMap.get(userId)));
    }

    isRefreshing(): boolean {
        return this.refreshing;
    }

    getNumberOfInvites(): number {
        return this.numInvites;
    }
}
