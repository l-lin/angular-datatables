```typescript
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ADTSettings } from 'angular-datatables/src/models/settings';

@Component({
  selector: 'app-using-ng-pipe',
  templateUrl: './using-ng-pipe.component.html'
})
export class UsingNgPipeComponent implements OnInit {

  constructor(
    private pipeInstance: UpperCasePipe,
    public pipeCurrencyInstance: CurrencyPipe
  ) { }

  dtOptions: ADTSettings = {};

  ngOnInit(): void {

    this.dtOptions = {
      ajax: 'data/data.json',
      columns: [
        {
          title: 'Id (Money)',
          data: 'id',
          ngPipeInstance: this.pipeCurrencyInstance,
          ngPipeArgs: ['USD','symbol']
        },
        {
          title: 'First name',
          data: 'firstName',
          ngPipeInstance: this.pipeInstance
        },
        {
          title: 'Last name',
          data: 'lastName',
          ngPipeInstance: this.pipeInstance
        }
      ]
    };

  }

}

```
