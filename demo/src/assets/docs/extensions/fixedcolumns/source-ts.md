```typescript
import { Component, OnInit } from '@angular/core';
import 'datatables.net-fixedcolumns-dt';

@Component({
  selector: 'app-fixed-columns-extension',
  templateUrl: 'fixed-columns-extension.component.html'
})
export class FixedColumnsExtensionComponent implements OnInit {

  // Unfortunately this still requires `any` due to "types" issues in fixedcolumns
  dtOptions: any = {};

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
      },
      {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      }, {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      }, {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      }, {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      }, {
        title: 'Last name',
        data: 'lastName'
      }

    ],
    // Make sure that scrollX is set to true for this to work!
    scrollX: true,
    fixedColumns: {
        left: 3,
        right: 0
      },
    };
  }
}

```
