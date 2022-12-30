import { HttpClientModule } from '@angular/common/http';
import { SecurityContext, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { AppRoutingModule } from 'app/app.routing';
import { BaseDemoComponent } from 'app/base-demo/base-demo.component';
import { MarkdownModule } from 'ngx-markdown';

import { NewServerSideComponent } from './new-server-side.component';

describe('NewServerSideComponent', () => {
  let component: NewServerSideComponent;
  let fixture: ComponentFixture<NewServerSideComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [
        BaseDemoComponent,
        NewServerSideComponent,
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
    }).createComponent(NewServerSideComponent);

    component = fixture.componentInstance;

    fixture.detectChanges(); // initial binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should have title "Server-side processing"', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance as NewServerSideComponent;
    expect(app.pageTitle).toBe('Server-side processing');
  }));

  it('should have table populated via AJAX', async () => {
    const app = fixture.debugElement.componentInstance as NewServerSideComponent;
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
