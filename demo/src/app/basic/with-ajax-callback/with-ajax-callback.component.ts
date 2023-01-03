import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataTablesResponse } from 'app/datatables-response.model';

@Component({
  selector: 'app-with-ajax-callback',
  templateUrl: './with-ajax-callback.component.html'
})
export class WithAjaxCallbackComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  pageTitle = 'AJAX with callback';
  mdIntro = 'assets/docs/basic/with-ajax-callback/intro.md';
  mdHTML = 'assets/docs/basic/with-ajax-callback/source-html.md';
  mdTS = 'assets/docs/basic/with-ajax-callback/source-ts.md';

  dtOptions: DataTables.Settings = {};

  ngOnInit(): void {
    const that = this;
    this.dtOptions = {
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
