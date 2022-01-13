import { SimpleTime } from "../local/simple-time";

export class SimpleTimeDTO {
    SimpleTimeId: number;
    intervalSideName: string;
    hours: number;
    minutes: number;
    seconds: number;

    mapToLocal(): SimpleTime {
        let localSimpleTime = new SimpleTime();
        localSimpleTime.hour = this.hours;
        localSimpleTime.minute = this.minutes;
        localSimpleTime.second = this.seconds;
        return localSimpleTime;
    }
}
