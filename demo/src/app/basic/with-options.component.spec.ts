import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from '../base-demo/base-demo.component';
import { WithOptionsComponent } from './with-options.component';
import { AppRoutingModule } from '../app.routing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

let fixture: ComponentFixture<WithOptionsComponent>, component: null| WithOptionsComponent = null;

describe('WithOptionsComponent', () => {
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
    declarations: [
        BaseDemoComponent,
        WithOptionsComponent,
        DataTableDirective
    ],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [AppRoutingModule,
        RouterTestingModule,
        DataTablesModule,
        MarkdownModule.forRoot({
            sanitize: SecurityContext.NONE
        })],
    providers: [provideHttpClient(withInterceptorsFromDi())]
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
