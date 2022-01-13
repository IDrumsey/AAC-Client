export class Notification {
    id: number;
    bgColor: string;
    message: string;

    constructor(id: number, color: string, message: string){
        this.id = id;
        this.bgColor = color;
        this.message = message;
    }
}
