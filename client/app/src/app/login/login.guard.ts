import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth.service";

/**
 * A login guard to check if a user is logged in or not.
 * the guard will automatically redirect the user to the login page
 */
@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    constructor(readonly auth: AuthService, readonly router: Router) {
    }

    canActivate() {
        if (!this.auth.loggedIn) {
            this.router.navigateByUrl('/login');
            return false;
        }
        return true;
    }
}
