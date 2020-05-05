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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OverlayModule } from "@angular/cdk/overlay";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PeopleListComponent } from './people-list/people-list.component';
import { MatListModule } from "@angular/material/list";
import { SearchComponent } from './search/search.component';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { SearchResultDialogComponent } from "./search/search-result-dialog/search-result-dialog.component";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule } from "@angular/material/snack-bar";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent,
        ToolbarComponent,
        PeopleListComponent,
        SearchComponent,
        SearchResultDialogComponent,
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
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatCardModule,
        MatDialogModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,

        // MatCheckboxModule,
        // MatDatepickerModule,
        // MatFormFieldModule,
        // MatRadioModule,
        // MatSelectModule,
        // MatSliderModule,
        // MatSlideToggleModule,
        // MatMenuModule,
        // MatSidenavModule,
        // MatToolbarModule,
        // MatListModule,
        // MatGridListModule,
        // MatStepperModule,
        // MatTabsModule,
        // MatExpansionModule,
        // MatButtonToggleModule,
        // MatChipsModule,
        // MatProgressBarModule,
        // MatTooltipModule,
        // MatSortModule,

    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
