import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from '../base-demo/base-demo.component';
import { ServerSideAngularWayComponent } from './server-side-angular-way.component';
import { AppRoutingModule } from '../app.routing';


let fixture: ComponentFixture<ServerSideAngularWayComponent>, component: null| ServerSideAngularWayComponent = null;

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
        DataTablesModule,
        HttpClientModule,
        MarkdownModule.forRoot(
          {
            sanitize: SecurityContext.NONE
          }
        )
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).createComponent(ServerSideAngularWayComponent);

    component = fixture.componentInstance;

    fixture.detectChanges(); // initial binding
  });

  it('should create the app', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have title "Server side the Angular way"', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance as ServerSideAngularWayComponent;
    expect(app.pageTitle).toBe('Server side the Angular way');
  }));
});
