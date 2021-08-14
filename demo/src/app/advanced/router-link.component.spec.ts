import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from '../base-demo/base-demo.component';
import { AppRoutingModule } from '../app.routing';
import { FormsModule } from '@angular/forms';
import { RouterLinkComponent } from './router-link.component';
import { Router } from '@angular/router';


let fixture: ComponentFixture<RouterLinkComponent>, component: RouterLinkComponent = null, router: Router = null;

describe('RouterLinkComponent', () => {
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [
        BaseDemoComponent,
        RouterLinkComponent,
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
    }).createComponent(RouterLinkComponent);

    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges(); // initial binding
  });

  it('should create the app', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have title "Router Link"', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance as RouterLinkComponent;
    expect(app.pageTitle).toBe('Router Link');
  }));

  it('should open Person info on click', async () => {
    await fixture.whenStable();

    const rSpy = spyOn(router, 'navigate');

    const button = document.createElement('button');
    button.setAttribute('view-person-id', '3');
    fixture.nativeElement.appendChild(button);
    button.click();


    fixture.detectChanges();
    expect(rSpy).toHaveBeenCalledWith(["/person/3"]);
  });

});
