import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UserSearchResult } from "../../models/user-search-result";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { UserApi } from "../../api/user-api";
import { AuthService } from "../../login/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'app-search-result-dialog',
    templateUrl: 'search-result-dialog.html',
    styleUrls: ['./search-result-dialog.component.scss']
})
export class SearchResultDialogComponent implements OnInit {

    displayedColumns: string[] = ['position', 'name', 'email', 'actions'];
    dataSource: MatTableDataSource<UserSearchResult>;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public auth: AuthService,
                private _snackBar: MatSnackBar,
                public dialogRef: MatDialogRef<SearchResultDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: UserSearchResult[]) {
        this.dataSource = new MatTableDataSource<UserSearchResult>(data);
    }

    ngOnInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    async addFriend(option: UserSearchResult) {
        console.log("Adding friend: ", option);
        const user = await this.auth.getUserPromise();
        const added = await UserApi.addFriend(user.token, option.userId)
        if (!!added) {
            option.friendship.accepted = true
        }
        this._snackBar.open("Added Friend: " + option.email, null, {
            duration: 2000,
        });
    }

    close(): void {
        this.dialogRef.close();
    }

}
