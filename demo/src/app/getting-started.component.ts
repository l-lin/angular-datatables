import { Component } from '@angular/core';

@Component({
  selector: 'app-getting-started',
  templateUrl: 'getting-started.component.html'
})
export class GettingStartedComponent {
  nodeVersion = '8.9';
  npmVersion = '6';
  angularCliVersion = '6.0.1';
  npmInstallSnippet = `
<pre>
<code class="bash highlight">npm install jquery --save
npm install datatables.net --save
npm install datatables.net-dt --save
npm install angular-datatables --save
npm install @types/jquery --save-dev
npm install @types/datatables.net --save-dev</code>
</pre>`;

  angularJsonSnippet = `
<pre>
  <code class="json highlight">{
  "projects": {
    "your-app-name": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/datatables.net-dt/css/jquery.dataTables.css"
            ],
            "scripts": [
              "node_modules/jquery/dist/jquery.js",
              "node_modules/datatables.net/js/jquery.dataTables.js"
            ],
            ...
}</code>
</pre>
  `;

  ngModuleSnippet = `
<pre>
<code class="typescript highlight">import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DataTablesModule } from 'angular-datatables';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    DataTablesModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {}</code>
</pre>
  `;

  errorResolvingSymbolSnippet = `
<pre>
<code class="json highlight">{
  "compilerOptions": {
    ...
    "paths": {
      "@angular/*": [
        "../node_modules/@angular/*"
      ]
    }
  }
}</code>
</pre>
  `;
}
