import { Component, Inject, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-load-dt-options-with-promise',
  templateUrl: 'load-dt-options-with-promise.component.html'
})
export class LoadDtOptionsWithPromiseComponent implements OnInit {
  dtOptions: DataTables.Settings = {};

  constructor( @Inject(Http) private http: Http) { }

  ngOnInit(): void {
    this.dtOptions = this.http.get('data/dtOptions.json')
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
