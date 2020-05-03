import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from './login/login.component';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { DashboardComponent } from './dashboard/dashboard.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule } from "@angular/forms";
import { OverlayModule } from "@angular/cdk/overlay";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PeopleListComponent } from './people-list/people-list.component';
import { MatListModule } from "@angular/material/list";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent,
        ToolbarComponent,
        PeopleListComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        FormsModule,
        OverlayModule,
        MatTooltipModule,
        MatTooltipModule,
        MatListModule,

    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
