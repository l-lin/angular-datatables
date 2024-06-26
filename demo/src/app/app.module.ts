import { BrowserModule } from '@angular/platform-browser';
import { NgModule, SecurityContext } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { DataTablesModule } from 'angular-datatables';

import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome.component';
import { GettingStartedComponent } from './getting-started.component';
import { PersonComponent } from './person.component';

// Basic examples
import { ZeroConfigComponent } from './basic/zero-config.component';
import { WithOptionsComponent } from './basic/with-options.component';
import { WithAjaxComponent } from './basic/with-ajax.component';
import { AngularWayComponent } from './basic/angular-way.component';
import { ServerSideAngularWayComponent } from './basic/server-side-angular-way.component';

// Advanced examples
import { CustomRangeSearchComponent } from './advanced/custom-range-search.component';
import { DtInstanceComponent } from './advanced/dt-instance.component';
import { IndividualColumnFilteringComponent } from './advanced/individual-column-filtering.component';
import { LoadDtOptionsWithPromiseComponent } from './advanced/load-dt-options-with-promise.component';
import { RerenderComponent } from './advanced/rerender.component';
import { RowClickEventComponent } from './advanced/row-click-event.component';
import { MultipleTablesComponent } from './advanced/multiple-tables.component';
import { RouterLinkComponent } from './advanced/router-link.component';

// Using extension examples
import { ButtonsExtensionComponent } from './extensions/buttons-extension.component';
import { ColreorderExtensionComponent } from './extensions/colreorder-extension.component';
import { FixedColumnsExtensionComponent } from './extensions/fixed-columns-extension.component';
import { ResponsiveExtensionComponent } from './extensions/responsive-extension.component';
import { SelectExtensionComponent } from './extensions/select-extension.component';
import { UsingNgPipeComponent } from './advanced/using-ng-pipe.component';

// Using Angular Pipe
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';

// Markdown
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from './base-demo/base-demo.component';
import { FAQComponent } from './f-a-q/f-a-q.component';
import { UsingNgTemplateRefComponent } from './advanced/using-ng-template-ref.component';
import { DemoNgComponent } from './advanced/demo-ng-template-ref.component';
import { MoreHelpComponent } from './more-help/more-help.component';
import { WithAjaxCallbackComponent } from './basic/with-ajax-callback/with-ajax-callback.component';
import { NewServerSideComponent } from './basic/new-server-side/new-server-side.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    GettingStartedComponent,
    PersonComponent,
    ZeroConfigComponent,
    WithOptionsComponent,
    WithAjaxComponent,
    AngularWayComponent,
    ServerSideAngularWayComponent,
    CustomRangeSearchComponent,
    DtInstanceComponent,
    IndividualColumnFilteringComponent,
    LoadDtOptionsWithPromiseComponent,
    RerenderComponent,
    RowClickEventComponent,
    MultipleTablesComponent,
    RouterLinkComponent,
    ButtonsExtensionComponent,
    ColreorderExtensionComponent,
    FixedColumnsExtensionComponent,
    ResponsiveExtensionComponent,
    SelectExtensionComponent,
    UsingNgPipeComponent,
    BaseDemoComponent,
    FAQComponent,
    UsingNgTemplateRefComponent,
    DemoNgComponent,
    MoreHelpComponent,
    WithAjaxCallbackComponent,
    NewServerSideComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    AppRoutingModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE
    })],
  providers: [
    UpperCasePipe,
    CurrencyPipe,
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppModule { }
