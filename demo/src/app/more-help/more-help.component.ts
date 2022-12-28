import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-more-help',
  templateUrl: './more-help.component.html',
  styleUrls: ['./more-help.component.css']
})
export class MoreHelpComponent implements OnInit {

  constructor() { }

  resourcesMd = 'assets/docs/more-help.md'

  ngOnInit(): void {
  }

}
