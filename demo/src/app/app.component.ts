import { Component, ElementRef, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular DataTables examples';

  ngOnInit(): void {
    $.fn.dataTable.ext.errMode = 'none';
  }
}
