import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { DtVersionService } from '../dt-version.service';
import { Subscription } from 'rxjs';

// needed to re-init tabs on route change
declare var $: JQueryStatic;

@Component({
  selector: 'app-base-demo',
  templateUrl: './base-demo.component.html',
  styleUrls: ['./base-demo.component.css']
})
export class BaseDemoComponent implements OnInit, OnDestroy {

  @Input() pageTitle = '';

  @Input() mdIntro = '';

  @Input() mdInstall = '';
  @Input() mdInstallV2 = '';

  @Input() mdHTML = '';
  @Input() mdHTMLV2 = '';

  @Input() mdTS = '';
  @Input() mdTSV2 = '';

  @Input() template: TemplateRef<any> = null;

  @Input() deprecated = false;

  dtVersion = null;
  dtVersionSubscription$: Subscription = null;

  constructor(
    private dtVersionService: DtVersionService
  ) {}

  ngOnInit() {
    // Re-init tabs on route change

    // Init back to top
    this.initBackToTop();

    this.dtVersionSubscription$ = this.dtVersionService.versionChanged$.subscribe(v => {
      console.log('dt version changed', v);
      this.dtVersion = v;
    });
  }

  private scrollCallback() {
    if ($(this).scrollTop()) {
      $('#toTop').fadeIn();
    } else {
      $('#toTop').fadeOut();
    }
  }

  initBackToTop() {
    // hide scroll button on page load
    $(this.scrollCallback);
    // scroll handler
    $(window).on('scroll', this.scrollCallback);

    $("#toTop").on('click', function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
  }

  ngOnDestroy(): void {
    this.dtVersionSubscription$?.unsubscribe();
  }

}
