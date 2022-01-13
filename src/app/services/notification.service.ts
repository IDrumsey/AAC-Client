import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

// models
import {Notification} from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  lastUsedId: number | null;

  // signals
  newNoteAddedEvent = new Subject<Notification>();

  constructor() { }

  addNotification(notification: Notification){
    // update the lastUsedId
    this.lastUsedId = notification.id;

    // signal that a new notification has been added
    this.signalNoteAdded(notification);
  }

  getNewId(){
    if(this.lastUsedId == null){
      return 1;
    }
    else{
      return this.lastUsedId + 1;
    }
  }

  signalNoteAdded(note: Notification){
    this.newNoteAddedEvent.next(note);
  }
}
