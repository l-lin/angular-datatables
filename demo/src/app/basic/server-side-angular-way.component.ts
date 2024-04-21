import { Component } from '@angular/core';
import { Person } from '../person';
import { Config } from 'datatables.net';

@Component({
  selector: 'app-server-side-angular-way',
  templateUrl: 'server-side-angular-way.component.html',
  styleUrls: ['server-side-angular-way.component.css']
})
export class ServerSideAngularWayComponent {

  pageTitle = 'Server side the Angular way';
  mdIntro = 'assets/docs/basic/server-side-angular-way/intro.md';
  mdHTML = 'assets/docs/basic/server-side-angular-way/source-html.md';
  mdTSV1 = 'assets/docs/basic/server-side-angular-way/source-ts.md';

  dtOptions: Config = {};
  persons!: Person[];
}
