import { Component, OnInit } from '@angular/core';
import { AuthService } from "../login/auth.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    constructor(public auth: AuthService) {
    }

    ngOnInit(): void {
    }

    getUserEmail(): Observable<string> {
        return this.auth.getUser().pipe(
            map(user => user ? user.email : '')
        );
    }
}
