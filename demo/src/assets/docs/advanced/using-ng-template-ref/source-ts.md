```typescript
// demo-ng-template-ref.component.ts

import { Component, Input, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { IDemoNgComponentEventType } from "./demo-ng-template-ref-event-type";

@Component({
  selector: "app-demo-ng-template-ref",
  templateUrl: "./demo-ng-template-ref.component.html",
})
export class DemoNgComponent implements OnInit {
  constructor() {}

  @Output()
  emitter = new Subject<IDemoNgComponentEventType>();

  @Input()
  data = {};

  ngOnInit(): void {}

  onAction1() {
    this.emitter.next({
      cmd: "action1",
      data: this.data,
    });
  }

  ngOnDestroy() {
    this.emitter.unsubscribe();
  }
}

// demo-ng-template-ref-event-type.ts

export interface IDemoNgComponentEventType {
  cmd: string;
  data: any;
}

// ng-template-ref.component.ts
import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ADTSettings } from "angular-datatables/src/models/settings";
import { Subject } from "rxjs";
import { IDemoNgComponentEventType } from "./demo-ng-template-ref-event-type";
import { DemoNgComponent } from "./demo-ng-template-ref.component";

@Component({
  selector: "app-using-ng-template-ref",
  templateUrl: "./using-ng-template-ref.component.html",
})
export class UsingNgTemplateRefComponent implements OnInit, AfterViewInit {
  constructor() {}

  pageTitle = "Using Angular TemplateRef";
  mdIntro = "assets/docs/advanced/using-ng-template-ref/intro.md";
  mdHTML = "assets/docs/advanced/using-ng-template-ref/source-html.md";
  mdTS = "assets/docs/advanced/using-ng-template-ref/source-ts.md";

  dtOptions: ADTSettings = {};
  dtTrigger = new Subject();

  @ViewChild("demoNg") demoNg: TemplateRef<DemoNgComponent>;

  ngOnInit(): void {}

  ngAfterViewInit() {
    const self = this;
    this.dtOptions = {
      ajax: "data/data.json",
      columns: [
        {
          title: "ID",
          data: "id",
        },
        {
          title: "First name",
          data: "firstName",
        },
        {
          title: "Last name",
          data: "lastName",
        },
        {
          title: "Actions",
          data: null,
          defaultContent: "",
          ngTemplateRef: {
            ref: this.demoNg,
            context: {
              // needed for capturing events inside <ng-template>
              captureEvents: self.onCaptureEvent.bind(self),
            },
          },
        },
      ],
    };

    // wait before loading table
    setTimeout(() => {
      this.dtTrigger.next();
    }, 200);
  }

  onCaptureEvent(event: IDemoNgComponentEventType) {
    console.log(event);
  }
}
```
