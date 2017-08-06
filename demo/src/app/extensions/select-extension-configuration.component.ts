import { Component } from '@angular/core';

@Component({
  selector: 'app-select-extension-configuration',
  template: `
<p class="caption">
  You can use the <a href="https://datatables.net/extensions/select/">Select extension</a> with angular-datatables.
</p>
<div class="col s12">
  <h4>NPM</h4>
  <p>You need to install its dependencies:</p>
  <section [innerHTML]="npmInstallSnippet" highlight-js-content=".bash"></section>
</div>
<div class="col s12">
  <h4 id="angular-cli">.angular-cli.json</h4>
  <p>Add the dependencies in the scripts and styles attributes:</p>
  <section [innerHTML]="angularCliJsonSnippet" highlight-js-content=".json"></section>
</div>
  `
})
export class SelectExtensionConfigurationComponent {
  npmInstallSnippet = `
<pre>
<code class="bash highlight"># JS file
npm install datatables.net-select --save
# CSS file
npm install datatables.net-select-dt --save
</pre>`;

  angularCliJsonSnippet = `
<pre>
  <code class="json highlight">{
  "apps": [
    {
      ...
      "styles": [
          ...
          "../node_modules/datatables.net-select-dt/css/select.dataTables.css",
      ],
      "scripts": [
        ...
        "../node_modules/datatables.net-select/js/dataTables.select.js"
      ],
      ...
    }
  ]
}</code>
</pre>
  `;
}
