import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from '../base-demo/base-demo.component';
import { ServerSideAngularWayComponent } from './server-side-angular-way.component';
import { AppRoutingModule } from '../app.routing';
import { By } from '@angular/platform-browser';


let fixture: ComponentFixture<ServerSideAngularWayComponent>, component: ServerSideAngularWayComponent = null;

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

  it('should have table populated via AJAX', async () => {
    const app = fixture.debugElement.componentInstance as ServerSideAngularWayComponent;
    await fixture.whenStable();
    expect(app.dtOptions.columns).toBeDefined();
    const query = fixture.debugElement.query(By.directive(DataTableDirective));
    const dir = query.injector.get(DataTableDirective);
    expect(dir).toBeTruthy();
    const instance = await dir.dtInstance;
    fixture.detectChanges();
    expect(instance.rows().length).toBeGreaterThan(0);
  });

});
