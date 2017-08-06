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
import { DtInstanceComponent } from './advanced/dt-instance.component';
import { DtInstanceSnippetComponent } from './advanced/dt-instance-snippet.component';
import { LoadDtOptionsWithPromiseComponent } from './advanced/load-dt-options-with-promise.component';
import { LoadDtOptionsWithPromiseSnippetComponent } from './advanced/load-dt-options-with-promise-snippet.component';
import { RerenderComponent } from './advanced/rerender.component';
import { RerenderSnippetComponent } from './advanced/rerender-snippet.component';
import { RowClickEventComponent } from './advanced/row-click-event.component';
import { RowClickEventSnippetComponent } from './advanced/row-click-event-snippet.component';

// Using extension examples
import { ButtonsExtensionComponent } from './extensions/buttons-extension.component';
import { ButtonsExtensionSnippetComponent } from './extensions/buttons-extension-snippet.component';
import { ButtonsExtensionConfigurationComponent } from './extensions/buttons-extension-configuration.component';
import { ColreorderExtensionComponent } from './extensions/colreorder-extension.component';
import { ColreorderExtensionSnippetComponent } from './extensions/colreorder-extension-snippet.component';
import { ColreorderExtensionConfigurationComponent } from './extensions/colreorder-extension-configuration.component';
import { SelectExtensionComponent } from './extensions/select-extension.component';
import { SelectExtensionSnippetComponent } from './extensions/select-extension-snippet.component';
import { SelectExtensionConfigurationComponent } from './extensions/select-extension-configuration.component';

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
    RerenderComponent,
    RerenderSnippetComponent,
    RowClickEventComponent,
    RowClickEventSnippetComponent,

    ButtonsExtensionComponent,
    ButtonsExtensionSnippetComponent,
    ButtonsExtensionConfigurationComponent,
    ColreorderExtensionComponent,
    ColreorderExtensionSnippetComponent,
    ColreorderExtensionConfigurationComponent,
    SelectExtensionComponent,
    SelectExtensionSnippetComponent,
    SelectExtensionConfigurationComponent
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
