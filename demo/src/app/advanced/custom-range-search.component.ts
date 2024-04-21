import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';

// Example from https://datatables.net/examples/plug-ins/range_filtering.html
@Component({
  selector: 'app-custom-range-search',
  templateUrl: 'custom-range-search.component.html'
})
export class CustomRangeSearchComponent implements OnDestroy, OnInit {

  pageTitle = 'Custom filtering - Range search';
  mdIntro = 'assets/docs/advanced/custom-range/intro.md';
  mdHTML = 'assets/docs/advanced/custom-range/source-html.md';
  mdTS = 'assets/docs/advanced/custom-range/source-ts.md';
  mdTSV1 = 'assets/docs/advanced/custom-range/source-ts-dtv1.md';

  @ViewChild(DataTableDirective, {static: false})
  datatableElement!: DataTableDirective;
  min!: number;
  max!: number;

  dtOptions: Config = {};

  ngOnInit(): void {
    // We need to call the $.fn.dataTable like this because DataTables typings do not have the "ext" property
    $.fn['dataTable'].ext.search.push((settings: Config, data: any, dataIndex: number) => {
      const id = parseFloat(data[0]) || 0; // use data for the id column
      if ((isNaN(this.min) && isNaN(this.max)) ||
        (isNaN(this.min) && id <= this.max) ||
        (this.min <= id && isNaN(this.max)) ||
        (this.min <= id && id <= this.max)) {
        return true;
      }
      return false;
    });

    this.dtOptions = {
      ajax: 'data/data.json',
      columns: [{
        title: 'ID',
        data: 'id'
      }, {
        title: 'First name',
        data: 'firstName'
      }, {
        title: 'Last name',
        data: 'lastName'
      }]
    };
  }

  ngOnDestroy(): void {
    // We remove the last function in the global ext search array so we do not add the fn each time the component is drawn
    // /!\ This is not the ideal solution as other components may add other search function in this array, so be careful when
    // handling this global variable
    $.fn['dataTable'].ext.search.pop();
  }

  filterById(): boolean {
    this.datatableElement.dtInstance.then(dtInstance => {
      dtInstance.draw();
    });
    return false;
  }
}
