import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IDemoNgComponentEventType } from './demo-ng-template-ref-event-type';
import { DemoNgComponent } from './demo-ng-template-ref.component';
import { ADTSettings } from 'angular-datatables/src/models/settings';

@Component({
    selector: 'app-router-link',
    templateUrl: 'router-link.component.html',
    standalone: false
})
export class RouterLinkComponent implements AfterViewInit, OnInit, OnDestroy {

  pageTitle = 'Router Link';
  mdIntro = 'assets/docs/advanced/router-link/intro.md';
  mdHTML = 'assets/docs/advanced/router-link/source-html.md';
  mdTSV1 = 'assets/docs/advanced/router-link/source-ts-dtv1.md';
  mdTS = 'assets/docs/advanced/router-link/source-ts.md';
  mdTSHeading = 'TypeScript';

  dtOptions: ADTSettings = {};
  dtTrigger = new Subject<ADTSettings>();

  @ViewChild('demoNg') demoNg!: TemplateRef<DemoNgComponent>;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const self = this;
    // init here as we use ViewChild ref
    this.dtOptions = {
      ajax: 'data/data.json',
      columns: [
        {
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
          title: 'Action',
          defaultContent: '',
          ngTemplateRef: {
            ref: this.demoNg,
            context: {
              // needed for capturing events inside <ng-template>
              captureEvents: self.onCaptureEvent.bind(self)
            }
          }
        }
      ]
    };

    // race condition fails unit tests if dtOptions isn't sent with dtTrigger
    setTimeout(() => {
      this.dtTrigger.next(this.dtOptions);
    }, 200);
  }

  onCaptureEvent(event: IDemoNgComponentEventType) {
    this.router.navigate(["/person/" + event.data.id]);
  }

  ngOnDestroy(): void {
    this.dtTrigger?.unsubscribe();
  }
}
