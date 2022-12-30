import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataTablesResponse } from 'app/datatables-response.model';

@Component({
  selector: 'app-new-server-side',
  templateUrl: './new-server-side.component.html',
  styleUrls: ['./new-server-side.component.css']
})
export class NewServerSideComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  pageTitle = 'Server-side processing';
  mdIntro = 'assets/docs/basic/new-server-side/intro.md';
  mdHTML = 'assets/docs/basic/new-server-side/source-html.md';
  mdTS = 'assets/docs/basic/new-server-side/source-ts.md';

  dtOptions: DataTables.Settings = {};

  ngOnInit(): void {
    const that = this;
    this.dtOptions = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            'https://xtlncifojk.eu07.qoddiapp.com/',
            dataTablesParameters, {}
          ).subscribe(resp => {
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data
            });
          });
      },
      columns: [{
        title: 'ID',
        data: 'id'
      }, {
        title: 'First name',
        data: 'firstName'
      }, {
        title: 'Last name',
        data: 'lastName'
      }]
    };
  }
}

