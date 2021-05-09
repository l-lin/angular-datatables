/* tslint:disable:no-unused-variable */

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from '../base-demo/base-demo.component';
import { ServerSideAngularWayComponent } from './server-side-angular-way.component';
import { AppRoutingModule } from '../app.routing';
import { By } from '@angular/platform-browser';

let fixture: ComponentFixture<ServerSideAngularWayComponent>, app: ServerSideAngularWayComponent = null,
  httpTestingController: HttpTestingController;

describe('ServerSideAngularWayComponent', () => {
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [
        BaseDemoComponent,
        ServerSideAngularWayComponent,
        DataTableDirective
      ],
      imports: [
        AppRoutingModule,
        RouterTestingModule,
        DataTablesModule.forRoot(),
        HttpClientTestingModule,
        MarkdownModule.forRoot(
          {
            sanitize: SecurityContext.NONE
          }
        )
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).createComponent(ServerSideAngularWayComponent);

    app = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture.detectChanges(); // initial binding
  });

  it('should create the app', waitForAsync(() => {
    expect(app).toBeTruthy();
  }));

  it('should have title "Server side the Angular way"', waitForAsync(() => {
    expect(app.pageTitle).toBe('Server side the Angular way');
  }));

  it('should have table populated via AJAX', () => {
    expect(app.dtOptions.columns).toBeDefined();
    const query = fixture.debugElement.query(By.directive(DataTableDirective));
    const dir = query.injector.get(DataTableDirective);
    expect(dir).toBeTruthy();
    // app.ngOnInit();
    // const req = httpTestingController.expectOne('https://angular-datatables-demo-server.herokuapp.com/');
    // expect(req.request.method).toBe('POST');
    const req = httpTestingController.expectOne('assets/docs/basic/server-side-angular-way/source-ts.md');
    expect(req.request.method).toBe('GET');
    fixture.detectChanges();
    const mockResponse = `{"draw":1,"recordsTotal":258,"recordsFiltered":258,"data":[{"id":"3","firstName":"Cartman","lastName":"Whateveryournameis"},{"id":"10","firstName":"Cartman","lastName":"Titi"}]}
      `;
    req.flush(mockResponse);

    httpTestingController.verify();
  });
});
