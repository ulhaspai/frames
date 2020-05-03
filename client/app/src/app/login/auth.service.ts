import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { BehaviorSubject, combineLatest, from, Observable, of, throwError } from "rxjs";
import { catchError, concatMap, map, shareReplay, tap } from "rxjs/operators";
import createAuth0Client, { Auth0Client, GetIdTokenClaimsOptions } from "@auth0/auth0-spa-js";
import { authConfig } from "./login.config";
import { Auth0User } from "../models/auth-user";

/**
 * Auth Service for Auth0
 *
 * @author Ulhas Pai
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // Create an observable of Auth0 instance of client
    auth0Client$ = (from(createAuth0Client(authConfig)) as Observable<Auth0Client>)
        .pipe(
            shareReplay(1), // Every subscription receives the same shared value
            catchError(err => throwError(err))
        );

    /**
     * Define observables for SDK methods that return promises by default
     * For each Auth0 SDK method, first ensure the client instance is ready
     * - concatMap: Using the client instance, call SDK method; SDK returns a promise
     * - from: Convert that resulting promise into an observable
     */
    isAuthenticated$ = this.auth0Client$.pipe(
        concatMap((client: Auth0Client) => from(client.isAuthenticated())),
        tap(res => this.loggedIn = res)
    );

    handleRedirectCallback$ = this.auth0Client$.pipe(
        concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
    );

    /**
     * subject user profile data
     */
    private userProfileSubject$ = new BehaviorSubject<any>(null);

    /**
     * observable user profile data
     * @see {@link #getUser} method for getting the currenly logged in user
     */
    private userProfile$ = this.userProfileSubject$.asObservable();

    /**
     * local property for login status
     */
    loggedIn: boolean = null;

    /**
     * constructor
     * @param router the application router
     */
    constructor(private router: Router) {
        // On initial load, check authentication state with authorization server
        // Set up local auth streams if user is already authenticated
        this.localAuthSetup();

        // Handle redirect from Auth0 login
        this.handleAuthCallback();
    }

    /**
     * @see https://auth0.github.io/auth0-spa-js/classes/auth0client.html#getuser
     * @param options optional options get getting the user
     * @retrn the current user observable
     */
    private getUser$(options?: GetIdTokenClaimsOptions): Observable<any> {
        return this.auth0Client$.pipe(
            concatMap((client: Auth0Client) => from(client.getIdTokenClaims(options))),
            tap(user => this.userProfileSubject$.next(user))
        );
    }

    /**
     * this method should be private, called only once during app initialization
     * in the constructor for this service
     */
    private localAuthSetup() {
        // Set up local authentication streams
        const checkAuth$ = this.isAuthenticated$.pipe(
            concatMap((loggedIn: boolean) => {
                if (loggedIn) {
                    // If authenticated, get user and set in app
                    // NOTE: you could pass options here if needed
                    return this.getUser$();
                }
                // If not authenticated, return stream that emits 'false'
                return of(loggedIn);
            })
        );
        checkAuth$.subscribe();
    }

    /**
     * the handler for after the user is logged in
     */
    private handleAuthCallback() {
        // Call when app reloads after user logs in with Auth0
        const params = window.location.search;
        if (params.includes('code=') && params.includes('state=')) {
            let targetRoute: string; // Path to redirect to after login processed
            const authComplete$ = this.handleRedirectCallback$.pipe(
                // Have client, now call method to handle auth callback redirect
                tap(cbRes => {
                    // Get and set target redirect route from callback results
                    targetRoute = cbRes.appState && cbRes.appState.target ? cbRes.appState.target : authConfig.redirect_uri;
                }),
                concatMap(() => {
                    // Redirect callback complete; get user and login status
                    return combineLatest([
                        this.getUser$(),
                        this.isAuthenticated$
                    ]);
                })
            );

            // Subscribe to authentication completion observable
            // Response will be an array of user and login status
            authComplete$.subscribe(([user, loggedIn]) => {
                // Redirect to target route after callback processing
                this.router.navigate([targetRoute]);
            });
        }
    }

    /**
     * the call with log in the user using Auth0's universal login
     *
     * @param redirectPath where to redirect the user to after login
     */
    public login(redirectPath: string = '/') {
        // A desired redirect path can be passed to login method
        // (e.g., from a route guard)
        // Ensure Auth0 client instance exists
        this.auth0Client$.subscribe((client: Auth0Client) => {
            // Call method to log in
            client.loginWithRedirect({
                redirect_uri: authConfig.redirect_uri,
                appState: {target: redirectPath}
            });
        });
    }

    /**
     * logs out the user and redirects to the return to page configured
     * in the login configs
     */
    public logout() {
        // Ensure Auth0 client instance exists
        this.auth0Client$.subscribe((client: Auth0Client) => {
            // Call method to log out
            client.logout({
                client_id: authConfig.client_id,
                returnTo: authConfig.returnTo
            });
        });
    }

    /**
     * @return the {@link Auth0User} object for the currently logged in user
     */
    public getUser(): Observable<Auth0User> {
        return this.userProfile$.pipe(
            map(user => {
                return {
                    token: user.__raw,
                    nickname: user.nickname,
                    name: user.name,
                    picture: user.picture,
                    updatedAt: user.updated_at,
                    email: user.email,
                    emailVerified: user.email_verified,
                    iss: user.iss,
                    sub: user.sub,
                    aud: user.aud,
                    iat: user.iat,
                    exp: user.exp,
                    nonce: user.nonce
                }
            })
        );
    }
}
