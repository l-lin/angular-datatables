import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from '../base-demo/base-demo.component';
import { ZeroConfigComponent } from './zero-config.component';
import { AppRoutingModule } from '../app.routing';
import { By } from '@angular/platform-browser';

let fixture: ComponentFixture<ZeroConfigComponent>, component: ZeroConfigComponent = null;

describe('ZeroConfigComponent', () => {
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [
        BaseDemoComponent,
        ZeroConfigComponent,
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
    }).createComponent(ZeroConfigComponent);

    component = fixture.componentInstance;

    fixture.detectChanges(); // initial binding
  });

  it('should create the app', function(done) {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
    done();
  });

  it('should have title "Zero configuration"', function(done) {
    const app = fixture.debugElement.componentInstance as ZeroConfigComponent;
    expect(app.pageTitle).toBe('Zero configuration');
    done();
  });

  it('should create DataTables instance', function(done) {
    const query = fixture.debugElement.query(By.directive(DataTableDirective));
    const dir = query.injector.get(DataTableDirective);
    expect(dir).toBeTruthy();
    dir.dtInstance
    .then(i => {
      expect($.fn.dataTable.isDataTable(i)).toBeTruthy();
      done();
    })
    .catch(e => {
      done.fail(e);
    });
    done();
  });

});
