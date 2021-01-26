import { BrowserModule } from '@angular/platform-browser';
import { NgModule, SecurityContext } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AngularHighlightJsModule } from 'angular2-highlight-js';

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
import { WithAjaxSnippetComponent } from './basic/with-ajax-snippet.component';
import { AngularWayComponent } from './basic/angular-way.component';
import { AngularWaySnippetComponent } from './basic/angular-way-snippet.component';
import { ServerSideAngularWayComponent } from './basic/server-side-angular-way.component';
import { ServerSideAngularWaySnippetComponent } from './basic/server-side-angular-way-snippet.component';

// Advanced examples
import { CustomRangeSearchComponent } from './advanced/custom-range-search.component';
import { CustomRangeSearchSnippetComponent } from './advanced/custom-range-search-snippet.component';
import { DtInstanceComponent } from './advanced/dt-instance.component';
import { DtInstanceSnippetComponent } from './advanced/dt-instance-snippet.component';
import { IndividualColumnFilteringComponent } from './advanced/individual-column-filtering.component';
import { IndividualColumnFilteringSnippetComponent } from './advanced/individual-column-filtering-snippet.component';
import { LoadDtOptionsWithPromiseComponent } from './advanced/load-dt-options-with-promise.component';
import { LoadDtOptionsWithPromiseSnippetComponent } from './advanced/load-dt-options-with-promise-snippet.component';
import { RerenderComponent } from './advanced/rerender.component';
import { RerenderSnippetComponent } from './advanced/rerender-snippet.component';
import { RowClickEventComponent } from './advanced/row-click-event.component';
import { RowClickEventSnippetComponent } from './advanced/row-click-event-snippet.component';
import { MultipleTablesComponent } from './advanced/multiple-tables.component';
import { MultipleTablesSnippetComponent } from './advanced/multiple-tables-snippet.component';
import { RouterLinkComponent } from './advanced/router-link.component';
import { RouterLinkSnippetComponent } from './advanced/router-link-snippet.component';

// Using extension examples
import { ButtonsExtensionComponent } from './extensions/buttons-extension.component';
import { ButtonsExtensionSnippetComponent } from './extensions/buttons-extension-snippet.component';
import { ButtonsExtensionConfigurationComponent } from './extensions/buttons-extension-configuration.component';
import { ColreorderExtensionComponent } from './extensions/colreorder-extension.component';
import { ColreorderExtensionSnippetComponent } from './extensions/colreorder-extension-snippet.component';
import { ColreorderExtensionConfigurationComponent } from './extensions/colreorder-extension-configuration.component';
import { ResponsiveExtensionComponent } from './extensions/responsive-extension.component';
import { ResponsiveExtensionSnippetComponent } from './extensions/responsive-extension-snippet.component';
import { ResponsiveExtensionConfigurationComponent } from './extensions/responsive-extension-configuration.component';
import { SelectExtensionComponent } from './extensions/select-extension.component';
import { SelectExtensionSnippetComponent } from './extensions/select-extension-snippet.component';
import { SelectExtensionConfigurationComponent } from './extensions/select-extension-configuration.component';
import { UsingNgPipeComponent } from './advanced/using-ng-pipe.component';
import { UsingNgPipeSnippetComponent } from './advanced/using-ng-pipe-snippet.component';

// HightlightJS
import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);

// Using Angular Pipe
import { UpperCasePipe } from '@angular/common';

// Markdown
import { MarkdownModule } from 'ngx-markdown';
import { BaseDemoComponent } from './base-demo/base-demo.component';

@NgModule({
    declarations: [
        AppComponent,
        WelcomeComponent,
        GettingStartedComponent,
        PersonComponent,

        ZeroConfigComponent,
        WithOptionsComponent,
        WithAjaxComponent,
        WithAjaxSnippetComponent,
        AngularWayComponent,
        AngularWaySnippetComponent,
        ServerSideAngularWayComponent,
        ServerSideAngularWaySnippetComponent,

        CustomRangeSearchComponent,
        CustomRangeSearchSnippetComponent,
        DtInstanceComponent,
        DtInstanceSnippetComponent,
        IndividualColumnFilteringComponent,
        IndividualColumnFilteringSnippetComponent,
        LoadDtOptionsWithPromiseComponent,
        LoadDtOptionsWithPromiseSnippetComponent,
        RerenderComponent,
        RerenderSnippetComponent,
        RowClickEventComponent,
        RowClickEventSnippetComponent,
        MultipleTablesComponent,
        MultipleTablesSnippetComponent,
        RouterLinkComponent,
        RouterLinkSnippetComponent,

        ButtonsExtensionComponent,
        ButtonsExtensionSnippetComponent,
        ButtonsExtensionConfigurationComponent,
        ColreorderExtensionComponent,
        ColreorderExtensionSnippetComponent,
        ColreorderExtensionConfigurationComponent,
        ResponsiveExtensionComponent,
        ResponsiveExtensionSnippetComponent,
        ResponsiveExtensionConfigurationComponent,
        SelectExtensionComponent,
        SelectExtensionSnippetComponent,
        SelectExtensionConfigurationComponent,
        UsingNgPipeComponent,
        UsingNgPipeSnippetComponent,
        BaseDemoComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AngularHighlightJsModule,
        HttpClientModule,
        DataTablesModule,
        AppRoutingModule,
        MarkdownModule.forRoot(
          {
            sanitize: SecurityContext.NONE
          }
        )
    ],
    providers: [
      UpperCasePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
