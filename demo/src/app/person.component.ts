import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Person } from './person';
import { PersonService } from './person.service';

@Component({
  selector: 'app-person',
  templateUrl: 'person.component.html',
  providers: [PersonService]
})
export class PersonComponent implements OnInit {
  person: Person;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private personService: PersonService
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.person = this.personService.getPerson(id);
  }

  goBack(): void {
    this.location.back();
  }
}
