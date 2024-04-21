import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DtVersionService {

  dtVersion: 'v2' | 'v1' = 'v2';

  versionChanged$ = new BehaviorSubject<'v1'|'v2'>(this.dtVersion);

  constructor() { }
}
