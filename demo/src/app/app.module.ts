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
import { ResponsiveExtensionComponent } from './extensions/responsive-extension.component';
import { SelectExtensionComponent } from './extensions/select-extension.component';
import { UsingNgPipeComponent } from './advanced/using-ng-pipe.component';

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
        ResponsiveExtensionComponent,
        SelectExtensionComponent,
        UsingNgPipeComponent,
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
