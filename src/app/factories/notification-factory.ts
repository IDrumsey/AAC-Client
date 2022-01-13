// models
import {CommonNotificationColors} from '../models/common-notification-colors';
import {Notification} from '../models/notification';

// services
import {NotificationService} from '../services/notification.service';

export class NotificationFactory {
    constructor(private noteService: NotificationService){}

    genSuccessNotification(msg: string){
        return new Notification(this.noteService.getNewId(), CommonNotificationColors.success, msg);
    }

    genWarningNotification(msg: string){
        return new Notification(this.noteService.getNewId(), CommonNotificationColors.warning, msg);
    }

    genErrorNotification(msg: string){
        return new Notification(this.noteService.getNewId(), CommonNotificationColors.error, msg);
    }

    genCustomNotification(color: string, msg: string){
        return new Notification(this.noteService.getNewId(), color, msg);
    }
}
