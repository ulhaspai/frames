import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-people-list',
    templateUrl: './people-list.component.html',
    styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit {

    folders: Section[] = [
        { name: 'Photos', updated: new Date('1/1/16')},
        { name: 'Recipes', updated: new Date('1/17/16')},
        { name: 'Work', updated: new Date('1/28/16')}
    ];
    notes: Section[] = [
        { name: 'Vacation Itinerary', updated: new Date('2/20/16')},
        { name: 'Kitchen Remodel', updated: new Date('1/18/16')}
    ];

    constructor() {
    }

    ngOnInit(): void {
    }

}

export interface Section {
    name: string;
    updated: Date;
}
