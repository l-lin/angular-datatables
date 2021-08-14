import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from '../base-demo/base-demo.component';
import { WithOptionsComponent } from './with-options.component';
import { AppRoutingModule } from '../app.routing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

let fixture: ComponentFixture<WithOptionsComponent>, component: WithOptionsComponent = null;

describe('WithOptionsComponent', () => {
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [
        BaseDemoComponent,
        WithOptionsComponent,
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
    }).createComponent(WithOptionsComponent);

    component = fixture.componentInstance;

    fixture.detectChanges(); // initial binding
  });


  it('should create the app', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have title "With Options"', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance as WithOptionsComponent;
    expect(app.pageTitle).toBe('With Options');
  }));

  it('should have pagingType as "full_numbers"', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance as WithOptionsComponent;
    expect(app.dtOptions.pagingType).toBe('full_numbers');
  }));

});
