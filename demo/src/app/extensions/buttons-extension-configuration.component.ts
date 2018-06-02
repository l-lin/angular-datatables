import { Component } from '@angular/core';

@Component({
  selector: 'app-buttons-extension-configuration',
  template: `
<p class="caption">
  You can use the <a href="https://datatables.net/extensions/buttons/">Buttons extension</a> with angular-datatables.
</p>
<div class="col s12">
  <h4>NPM</h4>
  <p>You need to install its dependencies:</p>
  <section [innerHTML]="npmInstallSnippet" highlight-js-content=".bash"></section>
</div>
<div class="col s12">
  <h4 id="angular-cli">angular.json</h4>
  <p>Add the dependencies in the scripts and styles attributes:</p>
  <section [innerHTML]="angularJsonSnippet" highlight-js-content=".json"></section>
  <blockquote>If you want to have the excel export functionnality, then you must import the <code>jszip.js</code> before the <code>buttons.html5.js</code> file.</blockquote>
</div>
  `
})
export class ButtonsExtensionConfigurationComponent {
  npmInstallSnippet = `
<pre>
<code class="bash highlight"># If you want to export excel files
npm install jszip --save
# JS file
npm install datatables.net-buttons --save
# CSS file
npm install datatables.net-buttons-dt --save
# Typings
npm install @types/datatables.net-buttons --save-dev
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
              ...
              "node_modules/datatables.net-buttons-dt/css/buttons.dataTables.css"
            ],
            "scripts": [
              ...
              "node_modules/jszip/dist/jszip.js",
              "node_modules/datatables.net-buttons/js/dataTables.buttons.js",
              "node_modules/datatables.net-buttons/js/buttons.colVis.js",
              "node_modules/datatables.net-buttons/js/buttons.flash.js",
              "node_modules/datatables.net-buttons/js/buttons.html5.js",
              "node_modules/datatables.net-buttons/js/buttons.print.js"
            ],
            ...
}</code>
</pre>
  `;
}
