import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// models
import { Store } from 'src/app/models/store.model';

// services
import { DataAccessService } from 'src/app/services/data-access.service';
import {StoreEventsService} from '../../services/store-events.service';
import {AuthenticationService} from '../../services/authentication.service';
import { StoreHours } from 'src/app/models/store-hours';
import {StoreHoursService} from '../../services/store-hours.service';
import {PageService} from '../../services/page.service';

const checkIfOpenDelaySeconds: number = 5;

@Component({
  selector: 'app-center-details',
  templateUrl: './center-details.component.html',
  styleUrls: ['./center-details.component.css']
})
export class CenterDetailsComponent implements OnInit {
  store: Store;
  dataLoading = true;
  isShowingInformation = true;
  isShowingInformationEditForm = !this.isShowingInformation;
  isShowingAddPicturesForm = false;
  isAdmin = false;
  pictures: string[] = [];
  hours: StoreHours;
  isCurrentlyOpen = false;
  openStatusReady = false;

  constructor(private dataService: DataAccessService, private activeRoute: ActivatedRoute, private storeEventService: StoreEventsService, private authService: AuthenticationService, private storeHoursService: StoreHoursService, private pageService: PageService, private router: Router) { }

  ngOnInit(): void {
    this.pageService.signalCenterDetailsPageLoadedEvent();

    this.getData();

    if(this.authService.isUserLoggedIn()){
      this.isAdmin = true;
    }

    this.authService.loginOrLogoutEvent.subscribe(val => {
      val ? this.userLoggedInHandler() : this.userLoggedOutHandler();
    })
  }

  getData(): void{
    this.activeRoute.params.subscribe(params => {
      let storeId = params['centerId'];

      this.dataService.getStoreById(storeId).then(storeFound => {
        this.store = storeFound;
        this.pictures = storeFound.pictures.map(picture => picture.path);
        this.dataLoadedHandler();
      })

      this.dataService.getStoreHours(storeId).then(storeHours => {
        this.hours = storeHours;
        this.isCurrentlyOpen = this.isStoreCurrentlyOpen();
        this.openStatusReady = true;
        this.keepCheckingOpenStatus();
      })
    })
  }

  userLoggedInHandler(): void{
    this.isAdmin = true;
  }

  userLoggedOutHandler(): void{
    this.isAdmin = true;
  }

  dataLoadedHandler(){
    this.dataLoading = false;
    this.storeEventService.signalStoreSelectedEvent(this.store);
  }

  openAddPicturesForm(){
    this.isShowingAddPicturesForm = true;
  }

  closeAddPicturesForm(){
    this.isShowingAddPicturesForm = false;
  }

  setStorePictures(pictures: string[]){
    this.pictures = pictures;
  }

  isStoreCurrentlyOpen(){
    // Bloater-LM
    
    // get the current day and time
    let now = new Date();
    let day = now.getDay();

    let open = false;
    
    switch(day){
      case 0:{
        // Sunday
        if(this.hours.Sunday.open == null){
          return false;
        }
        open = this.storeHoursService.checkIfOpen(this.hours.Sunday.open, this.hours.Sunday.close);
        break;
      }
      case 1:{
        // Monday
        if(this.hours.Monday.open == null){
          return false;
        }
        open = this.storeHoursService.checkIfOpen(this.hours.Monday.open, this.hours.Monday.close);
        break;
      }
      case 2:{
        // Tuesday
        if(this.hours.Tuesday.open == null){
          return false;
        }
        open = this.storeHoursService.checkIfOpen(this.hours.Tuesday.open, this.hours.Tuesday.close);
        break;
      }
      case 3:{
        // Wednesday
        if(this.hours.Wednesday.open == null){
          return false;
        }
        open = this.storeHoursService.checkIfOpen(this.hours.Wednesday.open, this.hours.Wednesday.close);
        break;
      }
      case 4:{
        // Thursday
        if(this.hours.Thursday.open == null){
          return false;
        }
        open = this.storeHoursService.checkIfOpen(this.hours.Thursday.open, this.hours.Thursday.close);
        break;
      }
      case 5:{
        // Friday
        if(this.hours.Friday.open == null){
          return false;
        }
        open = this.storeHoursService.checkIfOpen(this.hours.Friday.open, this.hours.Friday.close);
        break;
      }
      case 6:{
        // Saturday
        if(this.hours.Saturday.open == null){
          return false;
        }
        open = this.storeHoursService.checkIfOpen(this.hours.Saturday.open, this.hours.Saturday.close);
        break;
      }
    }

    return open;
  }

  onStoreHoursUpdated(newHours: StoreHours): void{
    this.hours = newHours;
    this.isCurrentlyOpen = this.isStoreCurrentlyOpen();
  }

  keepCheckingOpenStatus(): void{
    setInterval(() => {
      this.isCurrentlyOpen = this.isStoreCurrentlyOpen();
    }, checkIfOpenDelaySeconds * 1000);
  }

  routeToAnimals(): void{
    this.router.navigate(['centers', this.store.storeId, 'animals']);
  }
}
