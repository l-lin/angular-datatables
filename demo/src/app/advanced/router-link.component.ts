import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-router-link',
  templateUrl: 'router-link.component.html'
})
export class RouterLinkComponent implements AfterViewInit, OnInit {

  pageTitle = 'Router Link';
  mdIntro = 'assets/docs/advanced/router-link/intro.md';
  mdHTML = 'assets/docs/advanced/router-link/source-html.md';
  mdTS = 'assets/docs/advanced/router-link/source-ts.md';
  mdTSHigh = 'assets/docs/advanced/router-link/source-tsHigh.md';
  mdTSHeading = 'TypeScript (Angular v9 and below)';
  mdTSHighHeading = 'TypeScript (Angular v10 and above)';

  dtOptions: DataTables.Settings = {};

  constructor(private renderer: Renderer2, private router: Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      ajax: 'data/data.json',
      columns: [{
        title: 'ID',
        data: 'id'
      }, {
        title: 'First name',
        data: 'firstName'
      }, {
        title: 'Last name',
        data: 'lastName'
      }, {
        title: 'Action',
        render: function (data: any, type: any, full: any) {
          return '<button class="waves-effect btn" view-person-id="' + full.id + '">View</button>';
        }
      }]
    };
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute("view-person-id")) {
        this.router.navigate(["/person/" + event.target.getAttribute("view-person-id")]);
      }
    });
  }
}
