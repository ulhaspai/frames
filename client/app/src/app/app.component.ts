import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from "./login/auth.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
    title = 'frames';

    constructor(public auth: AuthService) {

    }

    ngOnInit(): void {

    }
}
