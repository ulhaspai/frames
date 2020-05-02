import { Component, OnInit } from '@angular/core';
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    constructor(public auth: AuthService, readonly router: Router) {
    }

    ngOnInit(): void {
        // Subscribe to is authenticated  observable
        this.auth.isAuthenticated$.subscribe((loggedIn) => {
            // Redirect to target route after callback processing
            this.gotoDashboard();
        });
    }

    gotoDashboard(): void {
        this.router.navigate(["/dashboard"]);
    }

}
