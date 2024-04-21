import { Component, OnInit } from '@angular/core';
import { DtVersionService } from './dt-version.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-getting-started',
  templateUrl: 'getting-started.component.html'
})
export class GettingStartedComponent implements OnInit {

  dtVersion: 'v2'|'v1' = 'v2';
  dtVersionSubscription$!: Subscription;

  mdV1 = 'assets/docs/get-started-dtv1.md';
  md = 'assets/docs/get-started.md'

  constructor(
    private dtVersionService: DtVersionService
  ) {}

  ngOnInit() {
    this.dtVersionSubscription$ = this.dtVersionService.versionChanged$.subscribe(v => {
      this.dtVersion = v;
    });
  }

}
