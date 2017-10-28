import { Component } from '@angular/core';

@Component({
  selector: 'app-responsive-extension-configuration',
  template: `
<p class="caption">
  You can use the <a href="https://datatables.net/extensions/responsive/">Responsive extension</a> with angular-datatables.
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
export class ResponsiveExtensionConfigurationComponent {
  npmInstallSnippet = `
<pre>
<code class="bash highlight"># JS file
npm install datatables.net-responsive --save
# CSS file
npm install datatables.net-responsive-dt --save
</pre>`;

  angularCliJsonSnippet = `
<pre>
  <code class="json highlight">{
  "apps": [
    {
      ...
      "styles": [
          ...
          "../node_modules/datatables.net-responsive-dt/css/responsive.dataTables.css",
      ],
      "scripts": [
        ...
        "../node_modules/datatables.net-responsive/js/dataTables.responsive.js"
      ],
      ...
    }
  ]
}</code>
</pre>
  `;
}
