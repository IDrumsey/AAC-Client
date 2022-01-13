import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import { Animal } from '../models/animal.model';

@Injectable({
  providedIn: 'root'
})
export class AnimalEventsService {
  animalSelectedEvent = new Subject<Animal>();

  constructor() { }

  getAnimalSelectedEventAsObservable(){
    return this.animalSelectedEvent.asObservable();
  }

  signalAnimalSelectedEvent(selectedAnimal: Animal){
    this.animalSelectedEvent.next(selectedAnimal);
  }
}
