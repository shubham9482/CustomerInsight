import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FilterService {

  constructor() { }

  private _listners = new Subject<any>();
  
      listen(): Observable<any> {
         return this._listners.asObservable();
      }
  
      filter(filter: any) {
         this._listners.next(filter);
      }
}
