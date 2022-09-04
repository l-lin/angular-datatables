import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Person } from '../person';

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

  pageTitle = 'Server side the Angular way';
  mdIntro = 'assets/docs/basic/server-side-angular-way/intro.md';
  mdHTML = 'assets/docs/basic/server-side-angular-way/source-html.md';
  mdTS = 'assets/docs/basic/server-side-angular-way/source-ts.md';

  dtOptions: DataTables.Settings = {};
  persons: Person[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            'https://xtlncifojk.eu07.qoddiapp.com/',
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.persons = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 'id' }, { data: 'firstName' }, { data: 'lastName' }]
    };
  }
}
