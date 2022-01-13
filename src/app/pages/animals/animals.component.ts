import { Component, OnInit } from '@angular/core';
import {Animal} from '../../models/animal.model';
import {DataAccessService} from '../../services/data-access.service';
import {ActivatedRoute} from '@angular/router';
import {PageService} from '../../services/page.service';
import { Store } from 'src/app/models/store.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-animals',
  templateUrl: './animals.component.html',
  styleUrls: ['./animals.component.css']
})
export class AnimalsComponent implements OnInit {
  classification: string = "all";
  store: Store;
  animals: Animal[];
  centerId: number;
  dataLoaded: boolean;

  constructor(private dataService : DataAccessService, private activeRoute : ActivatedRoute, private pageService : PageService, private router : Router) {
    this.loadData();
  }

  loadData(){
    this.activeRoute.params.subscribe(params => {
      this.centerId = parseInt(params['centerId']);
      this.classification = params['classification'];

      this.dataService.getStoreById(this.centerId).then(storeFound => {
        this.store = storeFound;
        this.checkAndHandlePageLoaded();
      })
  
      this.dataService.getStoreAnimals(this.centerId).then(animalsFound => {
        this.animals = animalsFound;
        this.checkAndHandlePageLoaded();
      })
    })
  }

  ngOnInit(): void {
    
  }

  isDataFullyLoaded(){
    return this.store != null && this.animals != null;
  }

  checkAndHandlePageLoaded(){
    if(this.isDataFullyLoaded()){
      // check if there are no animals in this category
      if(this.getAnimalsInClassification().length == 0){
        // route back to store animals page
        this.router.navigate(['centers', this.store.storeId, 'animals']);
      }
      else{
        this.dataLoaded = true;
        this.signalPageLoaded();
      }
    }
  }

  getAnimalsInClassification(){
    if(this.classification == "all"){
      return this.animals;
    }
    else{
      return this.animals.filter(animal => animal.classificationName == this.classification);
    }
  }

  signalPageLoaded(){
    this.pageService.signalCenterAnimalsPageLoadedEvent(this.store, this.getAnimalsInClassification());
  }
}
