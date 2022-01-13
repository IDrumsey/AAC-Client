import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

// models
import { Store } from 'src/app/models/store.model';
import { StoreHours } from 'src/app/models/store-hours';
import { UpdateCenter } from 'src/app/models/update-center';
import { SimpleTime } from 'src/app/models/simple-time';
import { OperationHoursAlias } from 'src/app/models/operation-hours-alias';
import { DayOperationHours } from 'src/app/models/day-operation-hours';
import { DayNames } from 'src/app/models/day-names';

// services
import {DataAccessService} from '../../services/data-access.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationFactory } from 'src/app/factories/notification-factory';
import { DayOperationHoursDto } from 'src/app/models/day-operation-hours-dto';
import { SimpleTimeDto } from 'src/app/models/simple-time-dto';
import { DayOperationHoursUploadDto } from 'src/app/models/day-operation-hours-upload-dto';
import { WeekDay } from '@angular/common';

@Component({
  selector: 'app-edit-store-form',
  templateUrl: './edit-store-form.component.html',
  styleUrls: ['./edit-store-form.component.css']
})
export class EditStoreFormComponent implements OnInit {
  @Input() store: Store;
  @Input() hours: StoreHours;
  form = new FormGroup({
    address: new FormControl(null),
    SundayHoursOpen: new FormControl(null),
    MondayHoursOpen: new FormControl(null),
    TuesdayHoursOpen: new FormControl(null),
    WednesdayHoursOpen: new FormControl(null),
    ThursdayHoursOpen: new FormControl(null),
    FridayHoursOpen: new FormControl(null),
    SaturdayHoursOpen: new FormControl(null),
    SundayHoursClose: new FormControl(null),
    MondayHoursClose: new FormControl(null),
    TuesdayHoursClose: new FormControl(null),
    WednesdayHoursClose: new FormControl(null),
    ThursdayHoursClose: new FormControl(null),
    FridayHoursClose: new FormControl(null),
    SaturdayHoursClose: new FormControl(null)
  })

  @Output() storeDetailsUpdatedEvent = new EventEmitter();
  @Output() cancelEditStoreDetailsEvent = new EventEmitter();

  noteFactory: NotificationFactory;

  constructor(private dataService: DataAccessService, private noteService: NotificationService) {
    this.noteFactory = new NotificationFactory(this.noteService);
  }

  ngOnInit(): void {
    // init the address field
    this.initBasicFields();
    this.initTimes();
  }

  initBasicFields(){
    this.form.controls["address"].setValue(this.store.address);
  }

  initTimes(){
    let controlNames: string[] = Object.values(DayNames);

    controlNames.forEach(controlName => {
      this.initDayTimeFields(controlName);
    })
  }

  initDayTimeFields(dayName: string): void {
    this.form.controls[dayName + "HoursOpen"].setValue(this.getTime(dayName, true));
    this.form.controls[dayName + "HoursClose"].setValue(this.getTime(dayName, false));
  }

  getTime(day: string, open: boolean){
    // Bloater-LM

    if(this.hours != null){
      switch(day){
        case "Sunday":{
          let hours = open ? this.hours.Sunday.open : this.hours.Sunday.close;
          // check if null
          if(hours == null){
            return ""
          }
          return this.formatTimeFromDate(hours);
        }
        case "Monday":{
          let hours = open ? this.hours.Monday.open : this.hours.Monday.close;
          // check if null
          if(hours == null){
            return ""
          }
          return this.formatTimeFromDate(hours);
        }
        case "Tuesday":{
          let hours = open ? this.hours.Tuesday.open : this.hours.Tuesday.close;
          // check if null
          if(hours == null){
            return ""
          }
          return this.formatTimeFromDate(hours);
        }
        case "Wednesday":{
          let hours = open ? this.hours.Wednesday.open : this.hours.Wednesday.close;
          // check if null
          if(hours == null){
            return ""
          }
          return this.formatTimeFromDate(hours);
        }
        case "Thursday":{
          let hours = open ? this.hours.Thursday.open : this.hours.Thursday.close;
          // check if null
          if(hours == null){
            return ""
          }
          return this.formatTimeFromDate(hours);
        }
        case "Friday":{
          let hours = open ? this.hours.Friday.open : this.hours.Friday.close;
          // check if null
          if(hours == null){
            return ""
          }
          return this.formatTimeFromDate(hours);
        }
        case "Saturday":{
          let hours = open ? this.hours.Saturday.open : this.hours.Saturday.close;
          // check if null
          if(hours == null){
            return ""
          }
          return this.formatTimeFromDate(hours);
        }
      }
    }
    return "";
  }

  formatTimeFromDate(date: Date): string {
    return `${this.formatTimeNum(date.getHours())}:${this.formatTimeNum(date.getMinutes())}`;
  }

  formatTimeNum(num: number): string {
    return num < 10 ? '0' + num.toString() : num.toString();
  }

  onSubmit(){
    let dataToSend = this.fieldDataToUpdateCenter();

    console.log("new data : ", dataToSend);

    this.dataService.updateStoreDetails(this.store.storeId, dataToSend).then(updatedStore => {
      this.noteService.addNotification(this.noteFactory.genSuccessNotification("Store details updated!"))
      this.signalUpdatedEvent()
    }).catch(err => {
      this.noteService.addNotification(this.noteFactory.genErrorNotification("Something went wrong"))
      console.log(err)
    })
  }

  fieldDataToUpdateCenter(){
    let toSend = new UpdateCenter();

    toSend.address = this.form.controls["address"].value;

    toSend.operationHours = this.mapAllDayHourFieldsToDayOperationHoursDTOs();

    return toSend;
  }

  getNonNullDayHours(allDayHours: (DayOperationHoursUploadDto | null)[]): DayOperationHoursUploadDto[]{
    let nonNullDayHours: DayOperationHoursUploadDto[] = [];

    allDayHours.forEach(dayHours => {
      if(dayHours != null){
        nonNullDayHours.push(dayHours);
      }
    })

    return nonNullDayHours;
  }

  mapAllDayHourFieldsToDayOperationHoursDTOs(): DayOperationHoursUploadDto[]{
    let SundayHours = this.mapDayHoursToDayOperationHoursUploadDTO(DayNames.Sunday, WeekDay.Sunday);
    let MondayHours = this.mapDayHoursToDayOperationHoursUploadDTO(DayNames.Monday, WeekDay.Monday);
    let TuesdayHours = this.mapDayHoursToDayOperationHoursUploadDTO(DayNames.Tuesday, WeekDay.Tuesday);
    let WednesdayHours = this.mapDayHoursToDayOperationHoursUploadDTO(DayNames.Wednesday, WeekDay.Wednesday);
    let ThursdayHours = this.mapDayHoursToDayOperationHoursUploadDTO(DayNames.Thursday, WeekDay.Thursday);
    let FridayHours = this.mapDayHoursToDayOperationHoursUploadDTO(DayNames.Friday, WeekDay.Friday);
    let SaturdayHours = this.mapDayHoursToDayOperationHoursUploadDTO(DayNames.Saturday, WeekDay.Saturday);

    let allHoursIncludingNullHours = [SundayHours, MondayHours, TuesdayHours, WednesdayHours, ThursdayHours, FridayHours, SaturdayHours];

    return this.getNonNullDayHours(allHoursIncludingNullHours);
  }

  mapDayHoursToDayOperationHoursUploadDTO(day: DayNames, dayIndex: WeekDay): DayOperationHoursUploadDto | null {
    let dto = new DayOperationHoursUploadDto();
    dto.day = dayIndex;

    if(this.form.controls[day + "HoursOpen"].value != null && this.form.controls[day + "HoursClose"].value){
      let openTime = this.mapFieldToSimpleTime(this.form.controls[day + "HoursOpen"].value, true);
      let closeTime = this.mapFieldToSimpleTime(this.form.controls[day + "HoursClose"].value, false);
      dto.times = [openTime, closeTime];
      return dto;
    }
    return null;
  }

  mapFieldToSimpleTime(time: string, open: boolean){
    // split hours and minutes
    let temp = time.split(':');
    let hours = temp[0];
    let minutes = temp[1];

    let simpleTimeDto = new SimpleTime();
    simpleTimeDto.intervalSide = open ? OperationHoursAlias.Open : OperationHoursAlias.Close;
    simpleTimeDto.hours = parseInt(hours);
    simpleTimeDto.minutes = parseInt(minutes);

    return simpleTimeDto;
  }

  signalUpdatedEvent(){
    this.storeDetailsUpdatedEvent.emit();
  }

  signalCancelEvent(){
    this.cancelEditStoreDetailsEvent.emit();
  }

  onCancelBtnClick(){
    this.signalCancelEvent();
  }
}
