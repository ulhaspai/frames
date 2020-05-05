import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { UserApi } from "../api/user-api";
import { AuthService } from "../login/auth.service";
import { Auth0User } from "../models/auth-user";
import { UserSearchResult } from "../models/user-search-result";
import { MatDialog } from "@angular/material/dialog";
import { SearchResultDialogComponent } from "./search-result-dialog/search-result-dialog.component";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    private auth0User$: Observable<Auth0User>;
    private auth0User: Auth0User;
    searchInput: FormControl;
    searchResults: UserSearchResult[];
    searching = false;

    constructor(public auth: AuthService, private fb: FormBuilder, public dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.auth0User$ = this.getAuth0User();
        this.auth0User$.subscribe(next => this.auth0User = next);
        this.searchInput = this.fb.control('');
    }

    getAuth0User(): Observable<Auth0User> {
        return this.auth.getUser()
    }

    async search(): Promise<void> {
        const query = this.searchInput.value;
        console.log("Searching: ", query)
        this.searching = true;
        this.searchResults = await UserApi.searchUsers(this.auth0User.token, query);
        this.searching = false;
        this.openSearchResultsDialog()
        return Promise.resolve();
    }

    openSearchResultsDialog(): void {
        this.dialog.open(SearchResultDialogComponent, {
            minWidth: '800px',
            data: this.searchResults
        });
    }

}
