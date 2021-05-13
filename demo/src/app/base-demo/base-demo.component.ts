import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-base-demo',
  templateUrl: './base-demo.component.html',
  styleUrls: ['./base-demo.component.css']
})
export class BaseDemoComponent {

  constructor() { }

  @Input()
  pageTitle = '';

  @Input()
  mdIntro = '';

  @Input()
  mdInstall = '';

  @Input()
  mdHTML = '';

  @Input()
  mdTS = '';

  @Input()
  mdTSHeading = 'TypeScript';

  @Input()
  mdTSHigh = '';

  @Input()
  mdTSHighHeading = '';

  @Input()
  template: TemplateRef<any> = null;

  scrollToElement($elem): void {
    $elem.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }

}
