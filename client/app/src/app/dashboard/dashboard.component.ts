import { Component, OnInit } from '@angular/core';
import { AuthService } from "../login/auth.service";
import { concatMap, map } from "rxjs/operators";
import { UserApi } from '../api/user-api';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    constructor(public auth: AuthService) {
    }

    ngOnInit(): void {
        this.getCurrentUser()
    }

    getCurrentUser(): void {
        this.auth.getUser().pipe(
            map(user => user.token)
        ).pipe(
            concatMap(token => UserApi.getCurrentUser(token))
        ).subscribe()
    }
}
