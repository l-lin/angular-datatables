import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from '../base-demo/base-demo.component';
import { AppRoutingModule } from '../app.routing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LoadDtOptionsWithPromiseComponent } from './load-dt-options-with-promise.component';


let fixture: ComponentFixture<LoadDtOptionsWithPromiseComponent>, component: null| LoadDtOptionsWithPromiseComponent = null;

describe('LoadDtOptionsWithPromiseComponent', () => {
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
    declarations: [
        BaseDemoComponent,
        LoadDtOptionsWithPromiseComponent,
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
}).createComponent(LoadDtOptionsWithPromiseComponent);

    component = fixture.componentInstance;

    fixture.detectChanges(); // initial binding
  });

  it('should create the app', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have title "Load DT Options with Promise"', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance as LoadDtOptionsWithPromiseComponent;
    expect(app.pageTitle).toBe('Load DT Options with Promise');
  }));

  it('should render table from dtOptions as a Promise', async () => {
    const app = fixture.componentInstance as LoadDtOptionsWithPromiseComponent;
    await fixture.whenStable();

    const query = fixture.debugElement.query(By.directive(DataTableDirective));
    const dir = query.injector.get(DataTableDirective);
    expect(dir).toBeTruthy();

    const instance = await dir.dtInstance;
    expect(instance.rows().count()).toBeGreaterThan(0);
  });

});
