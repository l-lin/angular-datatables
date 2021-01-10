import { UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ADTSettings } from 'angular-datatables/src/models/settings';

@Component({
  selector: 'app-using-ng-pipe',
  templateUrl: './using-ng-pipe.component.html'
})
export class UsingNgPipeComponent implements OnInit {

  constructor(
    private pipeInstance: UpperCasePipe
  ) { }

  dtOptions: ADTSettings = {}

  ngOnInit(): void {

    this.dtOptions = {
      ajax: 'data/data.json',
      columns: [
        {
          title: 'ID',
          data: 'id'
        },
        {
          title: 'First name',
          data: 'firstName',
          ngPipeInstance: this.pipeInstance
        },
        {
          title: 'Last name',
          data: 'lastName',
          ngPipeInstance: this.pipeInstance
        }
      ]
    }
  }

}
