/* tslint:disable:no-unused-variable */

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from '../base-demo/base-demo.component';
import { WithAjaxComponent } from './with-ajax.component';
import { AppRoutingModule } from '../app.routing';
import { By } from '@angular/platform-browser';


let fixture: ComponentFixture<WithAjaxComponent>, component: WithAjaxComponent = null;

describe('WithAjaxComponent', () => {
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [
        BaseDemoComponent,
        WithAjaxComponent,
        DataTableDirective
      ],
      imports: [
        AppRoutingModule,
        RouterTestingModule,
        DataTablesModule.forRoot(),
        HttpClientModule,
        MarkdownModule.forRoot(
          {
            sanitize: SecurityContext.NONE
          }
        )
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).createComponent(WithAjaxComponent);

    component = fixture.componentInstance;

    fixture.detectChanges(); // initial binding
  });

  it('should create the app', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have title "With Ajax"', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance as WithAjaxComponent;
    expect(app.pageTitle).toBe('With Ajax');
  }));

  it('should have table populated via AJAX', function (done) {
    const app = fixture.debugElement.componentInstance as WithAjaxComponent;
    expect(app.dtOptions.columns).toBeDefined();
    const query = fixture.debugElement.query(By.directive(DataTableDirective));
    const dir = query.injector.get(DataTableDirective);
    expect(dir).toBeTruthy();
    dir.dtInstance
      .then(_ => {
        // TODO use table instance to figure this out
        expect($('#preview table tbody').children().length).toBeGreaterThan(0);
        done();
      })
      .catch(e => {
        done.fail(e);
      });
    done();
    // // check table is populated
    // setTimeout(() => {
    // }, 700);
  });

});
