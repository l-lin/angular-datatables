import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';

@Component({
  selector: 'app-row-click-event',
  templateUrl: 'row-click-event.component.html'
})
export class RowClickEventComponent implements OnInit {

  pageTitle = 'Row click event';
  mdIntro = 'assets/docs/advanced/row-click/intro.md';
  mdHTML = 'assets/docs/advanced/row-click/source-html.md';
  mdTS = 'assets/docs/advanced/row-click/source-ts.md';
  mdTSV1 = 'assets/docs/advanced/row-click/source-ts-dtv1.md';

  message = '';
  dtOptions: Config = {};

  constructor() { }

  someClickHandler(info: any): void {
    this.message = info.id + ' - ' + info.firstName;
  }

  ngOnInit(): void {
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
      }],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        // Note: In newer jQuery v3 versions, `unbind` and `bind` are
        // deprecated in favor of `off` and `on`
        $('td', row).off('click');
        $('td', row).on('click', () => {
          self.someClickHandler(data);
        });
        return row;
      }
    };
  }
}
