import { Component, OnInit } from '@angular/core';

// models
import {Notification} from '../../models/notification';

// services
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-notification-manager',
  templateUrl: './notification-manager.component.html',
  styleUrls: ['./notification-manager.component.css']
})
export class NotificationManagerComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private noteService: NotificationService) { }

  ngOnInit(): void {
    // listen for new notifications to add
    this.noteService.newNoteAddedEvent.subscribe(note => {
      this.addNotification(note);
    })
  }

  startDeleteTimer(notification: Notification, delay: number){
    // wait time before automatically removing notification
    setTimeout(() => {
      this.deleteNotification(notification.id)},
      delay
      )
  }

  addNotification(note: Notification){
    this.notifications.push(note);

    // start delete timer
    this.startDeleteTimer(note, 5000);
  }

  deleteNotification(id: number){
    this.notifications = this.notifications.filter(note => note.id != id);
  }

}
