```typescript
import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';

@Component({
  selector: 'app-with-options',
  templateUrl: 'with-options.component.html'
})
export class WithOptionsComponent implements OnInit {

  dtOptions: Config = {};

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }
}

```
