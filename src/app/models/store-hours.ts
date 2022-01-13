import { DayNames } from "./day-names";
import { DayOperationHours } from "./day-operation-hours";

export class StoreHours {
    Sunday: DayOperationHours;
    Monday: DayOperationHours;
    Tuesday: DayOperationHours;
    Wednesday: DayOperationHours;
    Thursday: DayOperationHours;
    Friday: DayOperationHours;
    Saturday: DayOperationHours;

    constructor(){
        this.Sunday = new DayOperationHours(DayNames.Sunday);
        this.Monday = new DayOperationHours(DayNames.Monday);
        this.Tuesday = new DayOperationHours(DayNames.Tuesday);
        this.Wednesday = new DayOperationHours(DayNames.Wednesday);
        this.Thursday = new DayOperationHours(DayNames.Thursday);
        this.Friday = new DayOperationHours(DayNames.Friday);
        this.Saturday = new DayOperationHours(DayNames.Saturday);
    }
}
