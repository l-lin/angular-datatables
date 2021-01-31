import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-with-options',
  templateUrl: 'with-options.component.html'
})
export class WithOptionsComponent implements OnInit {

  pageTitle = 'With Options';
  mdIntro = 'assets/docs/basic/with-options/intro.md';
  mdHTML = 'assets/docs/basic/with-options/source-html.md';
  mdTS = 'assets/docs/basic/with-options/source-ts.md';


  dtOptions: DataTables.Settings = {};

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }
}
