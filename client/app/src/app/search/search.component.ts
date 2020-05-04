import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { UserApi } from "../api/user-api";
import { AuthService } from "../login/auth.service";
import { Auth0User } from "../models/auth-user";
import { debounceTime, switchMap } from "rxjs/operators";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {


    private auth0User$: Observable<Auth0User>;
    private auth0User: Auth0User;
    searchInput: FormControl;
    filteredOptions$: Observable<any>;

    constructor(public auth: AuthService, private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.auth0User$ = this.getAuth0User();
        this.auth0User$.subscribe(next => this.auth0User = next);

        this.searchInput = this.fb.control('');
        this.filteredOptions$ = this.searchInput.valueChanges.pipe(
            debounceTime(300),
            switchMap(query => UserApi.searchUsers(this.auth0User.token, query))
        )
    }

    getAuth0User(): Observable<Auth0User> {
        return this.auth.getUser()
    }

}
