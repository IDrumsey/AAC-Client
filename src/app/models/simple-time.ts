import { OperationHoursAlias } from "./operation-hours-alias";

export class SimpleTime {
    intervalSide: OperationHoursAlias;
    hours: number | null;
    minutes: number | null;
    seconds: number | null;

    constructor(){
        this.hours = null;
        this.minutes = null;
    }
}
