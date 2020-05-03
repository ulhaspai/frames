import { Component, OnInit } from '@angular/core';
import { AuthService } from "../login/auth.service";
import { Observable } from "rxjs";
import { concatMap, map } from "rxjs/operators";
import { User } from "../models/user";
import { UserApi } from "../api/user-api";

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    user$ : Observable<User>;

    constructor(public auth: AuthService) {
    }

    ngOnInit(): void {
        this.user$ = this.auth.getUser().pipe(
            map(user => {
                console.log("toolbar user: ", user)
                return user.token
            })
        ).pipe(
            concatMap(token => UserApi.getCurrentUser(token))
        )
    }


}
