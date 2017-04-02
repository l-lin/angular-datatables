import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';

import { DataTablesModule } from 'angular-datatables';

import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome.component';
import { GettingStartedComponent } from './getting-started.component';

// Basic examples
import { ZeroConfigComponent } from './basic/zero-config.component';
import { ZeroConfigSnippetComponent } from './basic/zero-config-snippet.component';
import { WithOptionsComponent } from './basic/with-options.component';
import { WithOptionsSnippetComponent } from './basic/with-options-snippet.component';
import { WithAjaxComponent } from './basic/with-ajax.component';
import { WithAjaxSnippetComponent } from './basic/with-ajax-snippet.component';
import { AngularWayComponent } from './basic/angular-way.component';
import { AngularWaySnippetComponent } from './basic/angular-way-snippet.component';

// Advanced examples
import {  DtInstanceComponent } from './advanced/dt-instance.component';
import {  DtInstanceSnippetComponent } from './advanced/dt-instance-snippet.component';
import { LoadDtOptionsWithPromiseComponent } from './advanced/load-dt-options-with-promise.component';
import { LoadDtOptionsWithPromiseSnippetComponent } from './advanced/load-dt-options-with-promise-snippet.component';
import { RowClickEventComponent } from './advanced/row-click-event.component';
import { RowClickEventSnippetComponent } from './advanced/row-click-event-snippet.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    GettingStartedComponent,

    ZeroConfigComponent,
    ZeroConfigSnippetComponent,
    WithOptionsComponent,
    WithOptionsSnippetComponent,
    WithAjaxComponent,
    WithAjaxSnippetComponent,
    AngularWayComponent,
    AngularWaySnippetComponent,

    DtInstanceComponent,
    DtInstanceSnippetComponent,
    LoadDtOptionsWithPromiseComponent,
    LoadDtOptionsWithPromiseSnippetComponent,
    RowClickEventComponent,
    RowClickEventSnippetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HighlightJsModule,
    HttpModule,
    DataTablesModule,
    AppRoutingModule
  ],
  providers: [
    HighlightJsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
