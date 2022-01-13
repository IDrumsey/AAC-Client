import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Store} from '../../models/store.model';
import {Animal} from '../../models/animal.model';
import {DataAccessService} from '../../services/data-access.service';
import {ActivatedRoute} from '@angular/router';
import {PageService} from '../../services/page.service';
import { PageEventsService } from 'src/app/services/page-events.service';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.css']
})
export class CenterComponent implements OnInit {
  centerId: number;
  store: Store;
  animals: Animal[];
  dataLoaded: boolean = false;

  constructor(private dataService : DataAccessService, private activeRoute : ActivatedRoute, private pageService : PageService, private pageEventsService : PageEventsService) { }

  ngOnInit(): void {
    this.getData();

    this.pageEventsService.animalAddedEvent.subscribe(animalAdded => {
      this.animals.push(animalAdded);
    })
  }

  getData(){
    this.activeRoute.params.subscribe(params => {
      this.centerId = parseInt(params['centerId']);

      this.dataService.getStoreById(this.centerId).then(storeFound => {
        this.store = storeFound;
        if(this.isDataFullyLoaded()){
          this.onDataFullyLoaded();
        }
      })
  
      this.dataService.getStoreAnimals(this.centerId).then(animalsFound => {
        this.animals = animalsFound;
        if(this.isDataFullyLoaded()){
          this.onDataFullyLoaded();
        }
      })
    })
  }

  isDataFullyLoaded(){
    return this.store != null && this.animals != null;
  }

  onDataFullyLoaded(){
    this.dataLoaded = true;
    this.signalPageLoaded(this.store);
  }

  getAnimalCategories(){
    // https://stackoverflow.com/questions/15125920/how-to-get-distinct-values-from-an-array-of-objects-in-javascript
    return [... new Set(this.animals.map(animal => animal.classificationName))];
  }

  signalPageLoaded(store: Store){
    this.pageService.signalCenterPageLoadedEvent(store);
  }
}
