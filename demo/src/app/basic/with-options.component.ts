import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-with-options',
  templateUrl: 'with-options.component.html'
})
export class WithOptionsComponent implements OnInit {
  dtOptions: DataTables.Settings = {};

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }
}
