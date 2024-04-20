import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { DtVersionService } from './dt-version.service';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  routerEventsSub$!: Subscription;

  dtVersion: 'v2' | 'v1' = 'v2';

  constructor(
    private router: Router,
    private dtVersionService: DtVersionService
  ) {
    this.dtVersion = dtVersionService.dtVersion;
  }

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

      // Init DT version picker
    $('.dt-version-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: true, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 14,
      belowOrigin: true,
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: true // Stops event propagation
    });

  }

  onDTVersionChanged(v: 'v2'|'v1') {
    this.dtVersion = v;
    this.dtVersionService.versionChanged$.next(v);
  }

  ngOnDestroy(): void {
    this.routerEventsSub$?.unsubscribe();
  }
}
