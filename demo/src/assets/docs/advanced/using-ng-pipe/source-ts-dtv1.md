```typescript
// app.module.ts
...,
providers: [
  UpperCasePipe,
  CurrencyPipe     // declare your Pipe here
],

// using-ng-pipe.component

import { UpperCasePipe, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ADTSettings } from 'angular-datatables/src/models/settings';

@Component({
  selector: 'app-using-ng-pipe',
  templateUrl: './using-ng-pipe.component.html'
})
export class UsingNgPipeComponent implements OnInit {

  constructor(
    private pipeInstance: UpperCasePipe, // inject the Pipe
    private pipeCurrencyInstance: CurrencyPipe // inject the Pipe
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
