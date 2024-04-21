import { Injectable } from '@angular/core';

import { Person } from './person';

import data from '../data/data.json';

@Injectable()
export class PersonService {
  constructor() { }

  getPerson(id: string): Person|undefined {
    const persons: Person[] = data.data;
    return persons.find(person => person?.id == parseInt(id));
  }
}
