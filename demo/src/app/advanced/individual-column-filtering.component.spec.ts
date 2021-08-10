import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from '../base-demo/base-demo.component';
import { AppRoutingModule } from '../app.routing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { IndividualColumnFilteringComponent } from './individual-column-filtering.component';


let fixture: ComponentFixture<IndividualColumnFilteringComponent>, component: IndividualColumnFilteringComponent = null;

function applyValueToInput(inputElement: HTMLInputElement, value: string, table: DataTables.Api) {
  inputElement.value = value;
  inputElement.dispatchEvent(new Event('input'));
  inputElement.dispatchEvent(new Event('change'));
  table.draw();
}

describe('IndividualColumnFilteringComponent', () => {
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [
        BaseDemoComponent,
        IndividualColumnFilteringComponent,
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
    }).createComponent(IndividualColumnFilteringComponent);

    component = fixture.componentInstance;

    fixture.detectChanges(); // initial binding
  });

  it('should create the app', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have title "Individual column searching"', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance as IndividualColumnFilteringComponent;
    expect(app.pageTitle).toBe('Individual column searching');
  }));

  it('should filter contents acc. to column', async () => {
    const app = fixture.componentInstance as IndividualColumnFilteringComponent;
    app.dtOptions.paging = false;

    await fixture.whenStable();

    const query = fixture.debugElement.query(By.directive(DataTableDirective));
    const dir = query.injector.get(DataTableDirective);
    expect(dir).toBeTruthy();

    const instance = await dir.dtInstance;

    const inputFields = Array.from(fixture.nativeElement.querySelectorAll('input')) as HTMLInputElement[];
    const inputFieldID = inputFields.find(e => e.name == "search-id");
    const inputFieldFirstName = inputFields.find(e => e.name == "search-first-name");
    const inputFieldLastName = inputFields.find(e => e.name == "search-last-name");

    // # Test 1
    applyValueToInput(inputFieldID, '113', instance);
    expect(instance.rows({ page: 'current' }).count()).toBe(1);

    // # Test 2

    // reset prev. field
    applyValueToInput(inputFieldID, '', instance);
    applyValueToInput(inputFieldFirstName, 'Batman', instance);
    expect(instance.rows({ page: 'current' }).count()).toBe(30);

    // # Test 3
    // reset prev. field
    applyValueToInput(inputFieldFirstName, '', instance);
    applyValueToInput(inputFieldLastName, 'Titi', instance);
    expect(instance.rows({ page: 'current' }).count()).toBe(28);

  });

});
