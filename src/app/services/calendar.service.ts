import { WeekDay } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }

  dayNameStringToWeekDay(dayName: string): WeekDay {
    switch(dayName) {
      case "Sunday" : {
        return WeekDay.Sunday;
      }
      case "Monday" : {
        return WeekDay.Monday;
      }
      case "Tuesday" : {
        return WeekDay.Tuesday;
      }
      case "Wednesday" : {
        return WeekDay.Wednesday;
      }
      case "Thursday" : {
        return WeekDay.Thursday;
      }
      case "Friday" : {
        return WeekDay.Friday;
      }
      case "Saturday" : {
        return WeekDay.Saturday;
      }
      default: {
        throw new Error("Couldn't convert DayName to WeekDay")
      }
    }
  }
}
