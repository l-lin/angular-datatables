import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from '../base-demo/base-demo.component';
import { AppRoutingModule } from '../app.routing';
import { FormsModule } from '@angular/forms';
import { RerenderComponent } from './rerender.component';


let fixture: ComponentFixture<RerenderComponent>, component: RerenderComponent = null;

describe('RerenderComponent', () => {
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [
        BaseDemoComponent,
        RerenderComponent,
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
    }).createComponent(RerenderComponent);

    component = fixture.componentInstance;

    fixture.detectChanges(); // initial binding
  });

  it('should create the app', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have title "Rerender"', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance as RerenderComponent;
    expect(app.pageTitle).toBe('Rerender');
  }));

  it('should recreate table when Rerender is clicked', async () => {
    const app = fixture.componentInstance as RerenderComponent;
    await fixture.whenStable();

    const rerenderSpy = spyOn(app, 'rerender' as any);

    const triggerBtns: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    const triggerBtn: HTMLButtonElement = triggerBtns.find(e => e.textContent.includes('Rerender'));

    triggerBtn.click();
    triggerBtn.dispatchEvent(new Event('click'));

    expect(rerenderSpy).toHaveBeenCalled();
  });

});
