import { Component } from '@angular/core';

@Component({
  selector: 'app-zero-config-snippet',
  template: `
  <div id="html" class="col s12 m9 l12">
    <h4 class="header">HTML</h4>
    <section [innerHTML]="htmlSnippet" highlight-js-content=".xml"></section>
  </div>
  <div id="ts" class="col s12 m9 l12">
    <h4 class="header">Typescript</h4>
    <section [innerHTML]="tsSnippet" highlight-js-content=".typescript"></section>
  </div>
  `
})
export class ZeroConfigSnippetComponent {
  htmlSnippet = `
<pre>
<code class="xml highlight">&lt;table datatable class="row-border hover"&gt;
  &lt;thead&gt;
    &lt;tr&gt;
      &lt;th&gt;ID&lt;/th&gt;
      &lt;th&gt;First name&lt;/th&gt;
      &lt;th&gt;Last name&lt;/th&gt;
    &lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr&gt;
      &lt;td&gt;1&lt;/td&gt;
      &lt;td&gt;Foo&lt;/td&gt;
      &lt;td&gt;Bar&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;td&gt;2&lt;/td&gt;
      &lt;td&gt;Someone&lt;/td&gt;
      &lt;td&gt;Youknow&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;td&gt;3&lt;/td&gt;
      &lt;td&gt;Iamout&lt;/td&gt;
      &lt;td&gt;Ofinspiration&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;td&gt;4&lt;/td&gt;
      &lt;td&gt;Yoda&lt;/td&gt;
      &lt;td&gt;Skywalker&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;td&gt;5&lt;/td&gt;
      &lt;td&gt;Patrick&lt;/td&gt;
      &lt;td&gt;Dupont&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;td&gt;6&lt;/td&gt;
      &lt;td&gt;Barack&lt;/td&gt;
      &lt;td&gt;Obama&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;td&gt;7&lt;/td&gt;
      &lt;td&gt;François&lt;/td&gt;
      &lt;td&gt;Holland&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;td&gt;8&lt;/td&gt;
      &lt;td&gt;Michel&lt;/td&gt;
      &lt;td&gt;Popo&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;td&gt;9&lt;/td&gt;
      &lt;td&gt;Chuck&lt;/td&gt;
      &lt;td&gt;Norris&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;td&gt;10&lt;/td&gt;
      &lt;td&gt;Simon&lt;/td&gt;
      &lt;td&gt;Robin&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;td&gt;11&lt;/td&gt;
      &lt;td&gt;Louis&lt;/td&gt;
      &lt;td&gt;Lin&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;td&gt;12&lt;/td&gt;
      &lt;td&gt;Zelda&lt;/td&gt;
      &lt;td&gt;Link&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt</code>
</pre>
  `;

  tsSnippet = `
<pre>
<code class="typescript highlight">import { Component } from '@angular/core';

@Component({
  selector: 'zero-config',
  templateUrl: 'zero-config.component.html'
})
export class ZeroConfigComponent {}
</code>
</pre>
  `;
}
