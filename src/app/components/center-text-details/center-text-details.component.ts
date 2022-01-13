import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DayNames } from 'src/app/models/day-names';
import { DayOperationHours } from 'src/app/models/day-operation-hours';
import { StoreHours } from 'src/app/models/store-hours';
import { Store } from 'src/app/models/store.model';
import {faPen} from '@fortawesome/free-solid-svg-icons';

// services
import {DataAccessService} from '../../services/data-access.service';
import {AuthenticationService} from '../../services/authentication.service';
import {StoreHoursService} from '../../services/store-hours.service';

@Component({
  selector: 'app-center-text-details',
  templateUrl: './center-text-details.component.html',
  styleUrls: ['./center-text-details.component.css']
})
export class CenterTextDetailsComponent implements OnInit {
  store: Store;
  storeHours: StoreHours;
  storeBasicDataLoading = true;
  storeHoursDataLoading = true;
  editIcon = faPen;
  isEditable = false;
  isOutlineShowing = false;
  isEditing = false;
  @Output() timeChangeEvent = new EventEmitter<StoreHours>();

  constructor(private dataService: DataAccessService, private activeRoute: ActivatedRoute, private authService: AuthenticationService, private storeHoursService: StoreHoursService) { }

  ngOnInit(): void {
    // Bloater-LM

    this.activeRoute.params.subscribe(params => {
      // get store id from the url
      let storeId = params["centerId"];

      // get the store data
      this.dataService.getStoreById(storeId).then(storeFound => {
        this.store = storeFound;
        this.storeBasicDataLoading = false;
      })

      // get hours data
      this.dataService.getStoreHours(storeId).then(storeHours => {
        this.storeHours = storeHours;
        this.storeHoursDataLoading = false;
      })
    })

    // check if user is logged in
    if(this.authService.isUserLoggedIn()){
      this.isEditable = true;
    }

    // listen for user log ins
    this.authService.loginOrLogoutEvent.subscribe(val => {
      if(val){
        this.userLoggedIn();
      }
      else{
        this.userLoggedOut();
      }
    })
  }

  userLoggedIn(){
    this.isEditable = true;
  }

  userLoggedOut(){
    this.isEditable = false;
    // send delete confirmation (F-2)

    // remove edit form
    this.isEditing = false;
    this.isOutlineShowing = false;
  }

  onEditBtnMouseOver(){
    this.isOutlineShowing = true;
  }

  onEditBtnMouseOut(){
    this.isOutlineShowing = false;
  }

  onEditBtnClick(){
    console.log("edit btn clicked");
    this.isEditing = true;
  }

  getWrapperStyles(){
    return {
      border: this.isOutlineShowing ? "2px solid #000" : "none"
    }
  }

  async onDetailsUpdated(){
    let storeId = await this.getStoreId();

    this.store = await this.dataService.getStoreById(storeId);

    this.storeBasicDataLoading = false;

    // get hours data
    this.dataService.getStoreHours(storeId).then(storeHours => {
      this.storeHours = storeHours;
      this.storeHoursDataLoading = false;
      // signal main details page that a time change has occured - I think this needs a conditional
      this.signalTimeUpdate(this.storeHours);
    })

  this.closeEditDetailsForm();
  }

  async getStoreId(): Promise<number>{
    // needs testing don't know if it works
    if(this.store.storeId){
      return this.store.storeId;
    }
    else{
      return await this.activeRoute.params.toPromise().then(params => {
        return params["centerId"]
      })
    }
  }

  closeEditDetailsForm(){
    this.isEditing = false;
  }

  formatHourStringReferer(time: Date){
    return this.storeHoursService.formatHourString(time);
  }

  signalTimeUpdate(hours: StoreHours){
    this.timeChangeEvent.emit(hours);
  }
}
