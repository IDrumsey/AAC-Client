import { DayNames } from "./day-names";

export class DayOperationHours {
    day: DayNames;
    open: Date;
    close: Date;

    constructor(day: DayNames){
        this.day = day;
    }
}
