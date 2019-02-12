import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SwitchofFormbuttonService {

  constructor() { }

  private _listners = new Subject<any>();
  
      listen(): Observable<any> {
         return this._listners.asObservable();
      }
  
      filter(switchoff: boolean) {
         this._listners.next(switchoff);
      }
}
