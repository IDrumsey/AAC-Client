import { Injectable } from '@angular/core';
import { DayNames } from '../models/day-names';
import { DayOperationHours } from '../models/day-operation-hours';
import { DayOperationHoursDto } from '../models/day-operation-hours-dto';
import { SimpleTimeDto } from '../models/simple-time-dto';
import { StoreHours } from '../models/store-hours';

@Injectable({
  providedIn: 'root'
})
export class StoreHoursService {

  constructor() { }

  convertDayOperationHoursDtoToStoreHours(dayOperationHoursDto: DayOperationHoursDto[]): StoreHours{
    let storeHours = new StoreHours();
    
    dayOperationHoursDto.forEach(opHours => {
      switch(opHours.dayName){
        case DayNames.Sunday: {
          this.addOpenAndCloseTimesToDayOperationHoursFromDayOperationHoursDto(opHours, storeHours.Sunday);
          break;
        }
        case DayNames.Monday: {
          this.addOpenAndCloseTimesToDayOperationHoursFromDayOperationHoursDto(opHours, storeHours.Monday);
          break;
        }
        case DayNames.Tuesday: {
          this.addOpenAndCloseTimesToDayOperationHoursFromDayOperationHoursDto(opHours, storeHours.Tuesday);
          break;
        }
        case DayNames.Wednesday: {
          this.addOpenAndCloseTimesToDayOperationHoursFromDayOperationHoursDto(opHours, storeHours.Wednesday);
          break;
        }
        case DayNames.Thursday: {
          this.addOpenAndCloseTimesToDayOperationHoursFromDayOperationHoursDto(opHours, storeHours.Thursday);
          break;
        }
        case DayNames.Friday: {
          this.addOpenAndCloseTimesToDayOperationHoursFromDayOperationHoursDto(opHours, storeHours.Friday);
          break;
        }
        case DayNames.Saturday: {
          this.addOpenAndCloseTimesToDayOperationHoursFromDayOperationHoursDto(opHours, storeHours.Saturday);
          break;
        }
      }
    })

    return storeHours;
  }

  addOpenAndCloseTimesToDayOperationHoursFromDayOperationHoursDto(dayOpHoursDto: DayOperationHoursDto, dayOpHours: DayOperationHours){
    let simpleOpenTimeDto = dayOpHoursDto.times.find(simpleTimeDto => simpleTimeDto.intervalSideName == "open")
    if(simpleOpenTimeDto){
      dayOpHours.open = this.convertSimpleTimeDtoToDate(simpleOpenTimeDto);
    }
    let simpleCloseTimeDto = dayOpHoursDto.times.find(simpleTimeDto => simpleTimeDto.intervalSideName == "close");
    if(simpleCloseTimeDto){
      dayOpHours.close = this.convertSimpleTimeDtoToDate(simpleCloseTimeDto);
    }
  }

  convertSimpleTimeDtoToDate(simpleTimeDto: SimpleTimeDto){
    let date = new Date();
    date.setHours(simpleTimeDto.hours);
    date.setMinutes(simpleTimeDto.minutes);
    date.setSeconds(simpleTimeDto.seconds);

    return date;
  }

  formatRawHoursData(data: any): StoreHours{
    let hours = new StoreHours();
    hours.Sunday = this.extractStoreHours(hours.Sunday, data);
    hours.Monday = this.extractStoreHours(hours.Monday, data);
    hours.Tuesday = this.extractStoreHours(hours.Tuesday, data);
    hours.Wednesday = this.extractStoreHours(hours.Wednesday, data);
    hours.Thursday = this.extractStoreHours(hours.Thursday, data);
    hours.Friday = this.extractStoreHours(hours.Friday, data);
    hours.Saturday = this.extractStoreHours(hours.Saturday, data);
    return hours;
  }

  extractStoreHours(hoursObj: DayOperationHours, rawData: any[]) : DayOperationHours{
    let dayOpenAndCloseTimeObjects: any[] | null = this.extractOpenAndCloseTimesOnDayFromRawData(hoursObj.day, rawData) // running this expression twice to get around typescript

    if(dayOpenAndCloseTimeObjects == null){
      return hoursObj;
    }

    let openTimeObject = this.extractOpenTimeFromRawDayOpenAndCloseTimes(dayOpenAndCloseTimeObjects);
    let closeTimeObject = this.extractCloseTimeFromRawDayOpenAndCloseTimes(dayOpenAndCloseTimeObjects);

    if(open != null){
      hoursObj.open = this.createDateWithTimeParams(openTimeObject.hours);
    }

    if(close != null){
      hoursObj.close = this.createDateWithTimeParams(closeTimeObject.hours);
    }

    return hoursObj;
  }

  extractOpenAndCloseTimesOnDayFromRawData(day: DayNames, rawDataObjectArray: any[]): any[] | null{
    let dayHours = rawDataObjectArray.find(dayHours => dayHours.dayName == day.toString())
    if(dayHours == null){
      return null
    }
    return dayHours.times;
  }

  extractOpenTimeFromRawDayOpenAndCloseTimes(dayOpenAndCloseTimeObjects: any[]){
    return dayOpenAndCloseTimeObjects.find(time => time.intervalSideName == "open");
  }

  extractCloseTimeFromRawDayOpenAndCloseTimes(dayOpenAndCloseTimeObjects: any[]){
    return dayOpenAndCloseTimeObjects.find(time => time.intervalSideName == "close");
  }

  createDateWithTimeParams(hours?: number, minutes?: number, seconds?: number){
    let time = new Date();
    if(hours){
      time.setHours(hours);
    }
    if(minutes){
      time.setMinutes(minutes);
    }
    if(seconds){
      time.setSeconds(seconds);
    }
    return time;
  }

  formatHourString(date: Date) : string{
    let half = date.getHours() <= 12 ? "AM" : "PM";

    let hours = half == "AM" ? date.getHours() : date.getHours() - 12;

    return `${this.formatNumberToString(hours)}:${this.formatNumberToString(date.getMinutes())} ${half}`;
  }

  /**
   * Prepends a '0' to the number if needed
   */
  formatNumberToString(num: number): string{
    if(num < 10){
      return `0${num.toString()}`;
    }
    else{
      return num.toString();
    }
  }

  isTimeBetween(time: Date, start: Date, end: Date){
    return (time > start && time < end);
  }

  timeToCurrentDate(time: Date){
    let currDate = new Date();
    currDate.setHours(time.getHours())
    currDate.setMinutes(time.getMinutes())
    return currDate;
  }

  checkIfOpen(open: Date, close: Date){
    // need to push the time to today's date to compare
    let openToday = this.timeToCurrentDate(open);
    let closeToday = this.timeToCurrentDate(close);
    return this.isTimeBetween(new Date(), openToday, closeToday);
  }
}
