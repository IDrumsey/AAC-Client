import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import {Animal} from '../../models/animal.model';
import {DataAccessService} from '../../services/data-access.service';
import {ActivatedRoute} from '@angular/router';
import {StoredPicture} from '../../models/stored-picture';
import {AnimalEventsService} from '../../services/animal-events.service';
import {PageService} from '../../services/page.service';
import { PageEventsService } from 'src/app/services/page-events.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationFactory } from 'src/app/factories/notification-factory';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-animal-information',
  templateUrl: './animal-information.component.html',
  styleUrls: ['./animal-information.component.css']
})
export class AnimalInformationComponent implements OnInit {
  animalId: number;
  animal: Animal;
  mainImagePath: string;
  otherImagePaths: string[] = [];
  showOtherPictures = false;
  dataLoaded: boolean = false;
  showingUserOptions = false;
  showingDeleteConfirmation = false;

  noteFactory: NotificationFactory;

  constructor(private dataService : DataAccessService, private activeRoute : ActivatedRoute, private animalEventsService : AnimalEventsService, private pageService : PageService, private pageEventsService : PageEventsService, private noteService : NotificationService, private router : Router, private authService : AuthenticationService) {
    this.noteFactory = new NotificationFactory(this.noteService);
  }

  ngOnInit(): void {
    this.loadData();

    this.listenAndHandleAnimalUpdateEvent();

    this.initAuth();
  }

  loadData(){
    this.activeRoute.params.subscribe(params => {
      this.animalId = parseInt(params['animalId']);

      this.dataService.getAnimalById(this.animalId).then(animalFound => {
        this.animal = animalFound;
        this.dataLoadedHandler();
      })
    })
  }

  listenAndHandleAnimalUpdateEvent(){
    this.pageEventsService.animalDataUpdatedEvent.subscribe(updatedAnimal => {
      if(this.isUpdatedAnimalSameAnimalOnPage(updatedAnimal)){
        this.animal = updatedAnimal;
      }
    })
  }

  isUpdatedAnimalSameAnimalOnPage(updatedAnimal: Animal){
    return this.animal.animalId == updatedAnimal.animalId;
  }

  initAuth(){
    if(this.authService.isUserLoggedIn()){
      this.showingUserOptions = true;
    }

    this.authService.loginOrLogoutEvent.subscribe(val => {
      val ? this.onUserLogin() : this.onUserLogout();
    })
  }

  onUserLogin(){
    this.showingUserOptions = true;
  }

  onUserLogout(){
    this.showingUserOptions = false;
  }

  dataLoadedHandler(){
    this.dataLoaded = true;

    this.mainImagePath = this.animal.pictures[0].path;
  
    let allPics: StoredPicture[] = this.animal.pictures;

    this.mainImagePath = allPics[0].path;

    if(this.animal.pictures.length > 1){
      this.showOtherPictures = true;
      this.otherImagePaths = this.getOtherPicturePaths();
    }

    // signal main page that data is ready
    this.signalDataReady(this.animal);
    this.signalPageReady();
  }

  signalPageReady(){
    this.pageService.signalAnimalInformationPageLoadedEvent(this.animal);
  }

  signalDataReady(animal : Animal){
    this.animalEventsService.signalAnimalSelectedEvent(this.animal);
  }

  getOtherPicturePaths(){
    return this.animal.pictures.map(picture => picture.path).slice(1);
  }

  showDeleteConfirmation(){
    this.showingDeleteConfirmation = true;
  }
  removeDeleteConfirmation(){
    this.showingDeleteConfirmation = false;
  }

  removeAnimal(){
    this.dataService.deleteAnimal(this.animal.animalId).then(deletedAnimal => {
      this.noteService.addNotification(this.noteFactory.genErrorNotification(`${deletedAnimal.name} removed!`));
      this.router.navigate(['centers', deletedAnimal.storeId, 'animals', deletedAnimal.classificationName]);
    })
  }

  cancelRemove(){
    // remove the confirm
    this.removeDeleteConfirmation();
  }

  confirmRemove(){
    // remove the confirm
    this.removeDeleteConfirmation();
    // remove the animal
    this.removeAnimal();
  }
}
