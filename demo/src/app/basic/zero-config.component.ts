import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BaseDemoComponent } from 'app/base-demo/base-demo.component';

@Component({
  selector: 'app-zero-config',
  templateUrl: 'zero-config.component.html'
})
export class ZeroConfigComponent {

  pageTitle = 'Zero configuration';
  mdIntro = 'assets/docs/basic/zero-config/intro.md';
  mdHTML = 'assets/docs/basic/zero-config/source-html.md';
  mdTS = 'assets/docs/basic/zero-config/source-ts.md';


}
