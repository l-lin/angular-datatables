import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  routerEventsSub$: Subscription = null;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    $.fn.dataTable.ext.errMode = 'none';
    $('.button-collapse').sideNav({
      closeOnClick: true
    });

    this.routerEventsSub$ = this.router.events
      .pipe(filter(_ => _ instanceof NavigationEnd))
      .subscribe(_ => {
        // Note: setTimeout is needed to let DOM render tabs
        setTimeout(() => {
          $('ul.tabs').tabs();
        }, 600);
      });
  }

  ngOnDestroy(): void {
    this.routerEventsSub$?.unsubscribe();
  }
}
