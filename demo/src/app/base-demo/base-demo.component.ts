import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

// needed to re-init tabs on route change
declare var $: any;

@Component({
  selector: 'app-base-demo',
  templateUrl: './base-demo.component.html',
  styleUrls: ['./base-demo.component.css']
})
export class BaseDemoComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  @Input()
  pageTitle = '';

  @Input()
  mdIntro = '';

  @Input()
  mdInstall = '';

  @Input()
  mdHTML = '';

  @Input()
  mdTS = '';

  @Input()
  mdTSHeading = 'TypeScript';

  @Input()
  mdTSHigh = '';

  @Input()
  mdTSHighHeading = '';

  @Input()
  template: TemplateRef<any> = null;

  @Input()
  deprecated = false;

  ngOnInit() {
    // Re-init tabs on route change
    this.router.events
      .pipe(filter(_ => _ instanceof NavigationEnd))
      .subscribe(_ => {
        $('ul.tabs').tabs();
      });

    // Init back to top
    this.initBackToTop();
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
    $().ready(this.scrollCallback);
    // scroll handler
    $(window).scroll(this.scrollCallback);

    $("#toTop").on('click', function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
  }

  scrollToElement($elem): void {
    $elem.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

}
