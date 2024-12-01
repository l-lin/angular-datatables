import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';

@Component({
    selector: 'app-multiple-tables',
    templateUrl: 'multiple-tables.component.html',
    standalone: false
})
export class MultipleTablesComponent implements OnInit {

  pageTitle = 'Multiple tables in the same page';
  mdIntro = 'assets/docs/advanced/multiple-tables/intro.md';
  mdHTML = 'assets/docs/advanced/multiple-tables/source-html.md';
  mdTS = 'assets/docs/advanced/multiple-tables/source-ts.md';
  mdTSV1 = 'assets/docs/advanced/multiple-tables/source-ts-dtv1.md';

  @ViewChildren(DataTableDirective)
  dtElements!: QueryList<DataTableDirective>;

  dtOptions: Config[] = [];

  displayToConsole(): void {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        console.log(`The DataTable ${index} instance ID is: ${dtInstance.table().node().id}`);
      });
    });
  }

  ngOnInit(): void {
    this.dtOptions[0] = this.buildDtOptions('data/data.json');
    this.dtOptions[1] = this.buildDtOptions('data/data1.json');
  }

  private buildDtOptions(url: string): Config {
    return {
      ajax: url,
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
}
