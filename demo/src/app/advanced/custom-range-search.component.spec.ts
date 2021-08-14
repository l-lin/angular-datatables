import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from '../base-demo/base-demo.component';
import { AppRoutingModule } from '../app.routing';
import { By } from '@angular/platform-browser';
import { CustomRangeSearchComponent } from './custom-range-search.component';
import { FormsModule } from '@angular/forms';


let fixture: ComponentFixture<CustomRangeSearchComponent>, component: CustomRangeSearchComponent = null;

describe('CustomRangeSearchComponent', () => {
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [
        BaseDemoComponent,
        CustomRangeSearchComponent,
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
    }).createComponent(CustomRangeSearchComponent);

    component = fixture.componentInstance;

    fixture.detectChanges(); // initial binding
  });

  it('should create the app', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have title "Custom filtering - Range search"', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance as CustomRangeSearchComponent;
    expect(app.pageTitle).toBe('Custom filtering - Range search');
  }));

  it('should have data filtered when min, max values change', async () => {
    const app = fixture.componentInstance as CustomRangeSearchComponent;
    await fixture.whenStable();

    const query = fixture.debugElement.query(By.directive(DataTableDirective));
    const dir = query.injector.get(DataTableDirective);
    expect(dir).toBeTruthy();
    const instance = await dir.dtInstance;

    const inputFieldMin: HTMLInputElement = fixture.nativeElement.querySelector('input[name="min"]');
    const inputFieldMax: HTMLInputElement = fixture.nativeElement.querySelector('input[name="max"]');

    //  # Test 1

    inputFieldMin.value = '1';
    inputFieldMax.value = '5';

    inputFieldMin.dispatchEvent(new Event('input'));
    inputFieldMax.dispatchEvent(new Event('input'));

    instance.draw();
    fixture.detectChanges();

    expect(instance.rows({ page: 'current' }).count()).toBe(1);

    //  # Test 2

    inputFieldMin.value = '1';
    inputFieldMax.value = '15';

    inputFieldMin.dispatchEvent(new Event('input'));
    inputFieldMax.dispatchEvent(new Event('input'));

    instance.draw();
    fixture.detectChanges();

    expect(instance.rows({ page: 'current' }).count()).toBe(3);

  });

});
