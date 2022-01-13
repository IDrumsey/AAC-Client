import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import { Animal } from '../models/animal.model';

@Injectable({
  providedIn: 'root'
})
export class PageEventsService {
  // events
  animalDataUpdatedEvent = new Subject<Animal>();
  animalAddedEvent = new Subject<Animal>();

  constructor() { }
}
