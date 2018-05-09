import { Injectable } from '@angular/core';

import { Person } from './person';

import * as data from '../data/data.json';

@Injectable()
export class PersonService {
  constructor() { }

  getPerson(id: number): Person {
    const persons = (<any>data).data;
    return persons.filter(person => person.id === id)[0];
  }
}
