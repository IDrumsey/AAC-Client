import { CalendarService } from "src/app/services/calendar.service";
import { DayOperationHours } from "../local/day-operation-hours";
import { SimpleTimeDTO } from "./simple-time-dto";

export class DayOperationHoursDTO {
    DayOperationHoursId: number;
    dayName: string;
    times: SimpleTimeDTO[];

    constructor(private calendarService: CalendarService){}

    mapToLocal(): DayOperationHours {
        let localDOH = new DayOperationHours();
        localDOH.day = this.calendarService.dayNameStringToWeekDay(this.dayName);

        let openTimeDTO = this.times.find(time => time.intervalSideName == "open");
        if(openTimeDTO){
            localDOH.openTime = openTimeDTO.mapToLocal();
        }

        let closeTimeDTO = this.times.find(time => time.intervalSideName == "close");
        if(closeTimeDTO){
            localDOH.closeTime = closeTimeDTO.mapToLocal();
        }

        return localDOH;
    }
}
