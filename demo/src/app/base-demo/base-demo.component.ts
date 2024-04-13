import { Component, Input, OnInit, TemplateRef } from '@angular/core';

// needed to re-init tabs on route change
declare var $: JQueryStatic;

@Component({
  selector: 'app-base-demo',
  templateUrl: './base-demo.component.html',
  styleUrls: ['./base-demo.component.css']
})
export class BaseDemoComponent implements OnInit {

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
  template: TemplateRef<any> = null;

  @Input()
  deprecated = false;

  ngOnInit() {
    // Re-init tabs on route change

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
    $(this.scrollCallback);
    // scroll handler
    $(window).on('scroll', this.scrollCallback);

    $("#toTop").on('click', function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
  }

}
