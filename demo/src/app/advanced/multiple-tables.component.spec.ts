import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, QueryList, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from '../base-demo/base-demo.component';
import { AppRoutingModule } from '../app.routing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MultipleTablesComponent } from './multiple-tables.component';


let fixture: ComponentFixture<MultipleTablesComponent>, component: null| MultipleTablesComponent = null;

describe('MultipleTablesComponent', () => {
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
    declarations: [
        BaseDemoComponent,
        MultipleTablesComponent,
        DataTableDirective
    ],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [AppRoutingModule,
        RouterTestingModule,
        DataTablesModule,
        MarkdownModule.forRoot({
            sanitize: SecurityContext.NONE
        }),
        FormsModule],
    providers: [provideHttpClient(withInterceptorsFromDi())]
}).createComponent(MultipleTablesComponent);

    component = fixture.componentInstance;

    fixture.detectChanges(); // initial binding
  });

  it('should create the app', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have title "Multiple tables in the same page"', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance as MultipleTablesComponent;
    expect(app.pageTitle).toBe('Multiple tables in the same page');
  }));

  it('should have two table instances in dtElements', async () => {
    const app = fixture.componentInstance as MultipleTablesComponent;
    await fixture.whenStable();

    expect(app.dtElements.length).toBe(2);
  });

});
