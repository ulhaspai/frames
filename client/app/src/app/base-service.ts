import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Auth0User } from "./models/auth-user";
import { AuthService } from "./login/auth.service";


/**
 * Base service for all service
 *
 * @author Ulhas Pai
 */
export class BaseService {

    protected auth0UserSubject$: Subject<Auth0User>;
    protected auth0User$: Observable<Auth0User>;
    protected auth0User: Auth0User;

    constructor(auth: AuthService) {
        this.auth0User$ = auth.getUser();
        this.auth0UserSubject$ = new BehaviorSubject<Auth0User>(null);
        this.auth0User$.subscribe(next => {
            this.auth0User = next;
            this.auth0UserSubject$.next(this.auth0User);
        });
    }
}
