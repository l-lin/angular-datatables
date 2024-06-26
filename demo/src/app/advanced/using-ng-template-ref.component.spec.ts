import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from '../base-demo/base-demo.component';
import { AppRoutingModule } from '../app.routing';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { UsingNgTemplateRefComponent } from './using-ng-template-ref.component';
import { DemoNgComponent } from './demo-ng-template-ref.component';


let fixture: ComponentFixture<UsingNgTemplateRefComponent>, component: null| UsingNgTemplateRefComponent = null;

describe('UsingNgTemplateRefComponent', () => {
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
    declarations: [
        BaseDemoComponent,
        UsingNgTemplateRefComponent,
        DemoNgComponent,
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
    providers: [
        UpperCasePipe,
        provideHttpClient(withInterceptorsFromDi())
    ]
}).createComponent(UsingNgTemplateRefComponent);

    component = fixture.componentInstance;

    fixture.detectChanges(); // initial binding
  });

  it('should create the app', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have title "Using Angular TemplateRef"', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance as UsingNgTemplateRefComponent;
    expect(app.pageTitle).toBe('Using Angular TemplateRef');
  }));

  it('should have firstName, lastName columns have text in uppercase', async () => {
    const app = fixture.debugElement.componentInstance as UsingNgTemplateRefComponent;
    await fixture.whenStable();

    const query = fixture.debugElement.query(By.directive(DataTableDirective));
    const dir = query.injector.get(DataTableDirective);
    expect(dir).toBeTruthy();

    expect(app.message).toBe('');

    const row: HTMLTableRowElement = fixture.nativeElement.querySelector('tbody tr:first-child');
    const button = row.querySelector('button.btn-sm') as HTMLButtonElement;
    button.click();

    expect(app.message).toBe(`Event 'action1' with data '{}`);

  });

  it('should not crash when using "visible: false" for columns', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const query = fixture.debugElement.query(By.directive(DataTableDirective));
    const dir = query.injector.get(DataTableDirective);
    expect(dir).toBeTruthy();

    // hide first column
    (await dir.dtInstance).columns(0).visible(false);
    await fixture.whenRenderingDone();

    fixture.detectChanges();

    // verify app still works
    expect((await dir.dtInstance).column(0).visible()).toBeFalse();
  });


  it('should not have duplicate contents in ngTemplateRef column when navigating pages', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const query = fixture.debugElement.query(By.directive(DataTableDirective));
    const dir = query.injector.get(DataTableDirective);
    expect(dir).toBeTruthy();

    // trigger pagination events
    (await dir.dtInstance).page(2).draw(false);
    await fixture.whenRenderingDone();

    (await dir.dtInstance).page(0).draw(false);
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    // verify no duplication
    const firstRow = fixture.debugElement.query(By.css('tbody'));
    const templatedCell = firstRow.children[0].children[3];
    expect(templatedCell.children.length).toBe(1);
  });

});
