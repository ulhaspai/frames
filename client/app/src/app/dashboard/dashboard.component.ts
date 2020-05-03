import { Component, OnInit } from '@angular/core';
import { AuthService } from "../login/auth.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    constructor(public auth: AuthService) {
    }

    ngOnInit(): void {

    }

    printUser(): void {
        this.auth.getUser().subscribe(user => {
            console.log("User: ", user);
            console.log("User email: ", user.email);
            console.log("User token: ", user.token);
        });
    }
}
