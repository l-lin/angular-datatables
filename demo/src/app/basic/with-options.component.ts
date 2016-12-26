import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'with-options',
  templateUrl: 'with-options.component.html'
})
export class WithOptionsComponent implements OnInit {
  dtOptions: any = {};

  ngOnInit(): void {
    this.dtOptions = {
      displayLength: 2,
      paginationType: 'full_numbers'
    };
  }

  ngAfterViewInit(): void {
    $('ul.tabs').tabs();
  }
}
