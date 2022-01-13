import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import { Animal } from '../models/animal.model';
import { Store } from '../models/store.model';
import {CenterAnimalsMetaData} from '../models/center-animals-meta-data';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  animalInformationPageLoadedEvent = new Subject<Animal>();
  homePageLoadedEvent = new Subject();
  centerPageLoadedEvent = new Subject<Store>();
  centerAnimalsPageLoadedEvent = new Subject<CenterAnimalsMetaData>();
  centerDetailsPageLoadedEvent = new Subject();

  constructor() { }

  getAnimalInformationPageLoadedEventAsObservable(){
    return this.animalInformationPageLoadedEvent.asObservable();
  }

  signalAnimalInformationPageLoadedEvent(animal: Animal){
    this.animalInformationPageLoadedEvent.next(animal);
  }

  getHomePageLoadedEventAsObservable(){
    return this.homePageLoadedEvent.asObservable();
  }

  signalHomePageLoadedEvent(){
    this.homePageLoadedEvent.next();
  }

  getCenterPageLoadedEventAsObservable(){
    return this.centerPageLoadedEvent.asObservable();
  }

  signalCenterPageLoadedEvent(store: Store){
    this.centerPageLoadedEvent.next(store);
  }

  getCenterAnimalsPageLoadedEventAsObservable(){
    return this.centerAnimalsPageLoadedEvent.asObservable();
  }

  signalCenterAnimalsPageLoadedEvent(store: Store, animals: Animal[]){
    let metaData = new CenterAnimalsMetaData(store, animals);
    this.centerAnimalsPageLoadedEvent.next(metaData);
  }

  getCenterDetailsPageLoadedEventAsObservable(){
    return this.centerDetailsPageLoadedEvent.asObservable();
  }

  signalCenterDetailsPageLoadedEvent(){
    this.centerDetailsPageLoadedEvent.next();
  }
}
