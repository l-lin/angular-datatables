import { Component } from '@angular/core';

declare var $:any;

@Component({
  selector: 'zero-config',
  templateUrl: 'zero-config.component.html'
})
export class ZeroConfigComponent {
  ngAfterViewInit(): void {
    $('ul.tabs').tabs();
  }
}
