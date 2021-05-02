import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { IDemoNgComponentEventType } from './demo-ng-template-ref-event-type';

@Component({
  selector: 'app-demo-ng-template-ref',
  templateUrl: './demo-ng-template-ref.component.html',
})
export class DemoNgComponent implements OnInit {

  constructor() { }

  @Output()
  emitter = new Subject<IDemoNgComponentEventType>();

  @Input()
  data = {};

  ngOnInit(): void {
  }

  onAction1() {
    this.emitter.next({
      cmd: 'action1',
      data: this.data
    });
  }

  ngOnDestroy() {
    this.emitter.unsubscribe();
  }

}
