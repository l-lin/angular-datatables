import { AfterViewInit, Component, OnInit, Renderer } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-router-link',
  templateUrl: 'router-link.component.html'
})
export class RouterLinkComponent implements AfterViewInit, OnInit {
  dtOptions: DataTables.Settings = {};

  constructor(private renderer: Renderer, private router: Router) { }

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
    this.renderer.listenGlobal('document', 'click', (event) => {
      if (event.target.hasAttribute("view-person-id")) {
        this.router.navigate(["/person/" + event.target.getAttribute("view-person-id")]);
      }
    });
  }
}
