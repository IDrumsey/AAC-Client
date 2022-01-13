import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import { Store } from '../models/store.model';

@Injectable({
  providedIn: 'root'
})
export class StoreEventsService {
  storeSelectedEvent = new Subject<Store>();

  constructor() { }

  getStoreSelectedEventAsObservable(){
    return this.storeSelectedEvent.asObservable();
  }

  signalStoreSelectedEvent(selectedStore: Store){
    this.storeSelectedEvent.next(selectedStore);
  }
}
