import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

class Person {
    id: number;
    firstName: string;
    lastName: string;
}

class DataTablesResponse {
    data: any[];
    draw: number;
    recordsFiltered: number;
    recordsTotal: number;
}

@Component({
    selector: 'app-server-side-angular-way',
    templateUrl: 'server-side-angular-way.component.html',
    styleUrls: ['server-side-angular-way.component.css']
})
export class ServerSideAngularWayComponent implements OnInit {
    dtOptions: DataTables.Settings = {};
    persons: Person[] = [];

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        let that = this;

        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 2,
            serverSide: true,
            processing: true,
            ajax: (dataTablesParameters: any, callback) => {
                that.http
                    .post<DataTablesResponse>('api/Persons.php', dataTablesParameters, {})
                    .subscribe(resp => {
                        that.persons = resp.data;

                        callback({
                            recordsTotal: resp.recordsTotal,
                            recordsFiltered: resp.recordsFiltered,
                            data: [],
                        });
                    });
            },
            columns: [
                { data: "id" },
                { data: "firstName" },
                { data: "lastName" },
            ],
        };
    }
}
