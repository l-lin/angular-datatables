import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from '../base-demo/base-demo.component';
import { AppRoutingModule } from '../app.routing';
import { FormsModule } from '@angular/forms';
import { RowClickEventComponent } from './row-click-event.component';


let fixture: ComponentFixture<RowClickEventComponent>, component: RowClickEventComponent = null;

describe('RowClickEventComponent', () => {
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [
        BaseDemoComponent,
        RowClickEventComponent,
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
        ),
        FormsModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).createComponent(RowClickEventComponent);

    component = fixture.componentInstance;

    fixture.detectChanges(); // initial binding
  });

  it('should create the app', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have title "Row click event"', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance as RowClickEventComponent;
    expect(app.pageTitle).toBe('Row click event');
  }));

  it('should display row data on table cell click', async () => {
    const app = fixture.debugElement.componentInstance as RowClickEventComponent;
    await fixture.whenStable();

    //  Test
    const tr1 = fixture.nativeElement.querySelector('tbody tr:nth-child(1)');
    $('td:first-child', tr1).trigger('click');
    expect(app.message).toBe('3 - Cartman');

    //  Test 2
    const tr4 = fixture.nativeElement.querySelector('tbody tr:nth-child(4)');
    $('td:first-child', tr4).trigger('click');
    expect(app.message).toBe('22 - Luke');

    //  Test 3
    const tr7 = fixture.nativeElement.querySelector('tbody tr:nth-child(7)');
    $('td:first-child', tr7).trigger('click');
    expect(app.message).toBe('32 - Batman');
  });

});
