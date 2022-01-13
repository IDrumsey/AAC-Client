import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  // animations
  animations: [
    trigger('slideState', [
      state('inView', style({
        right: '10px'
      })),
      state('outOfView', style({
        right: '-100vw'
      })),
      transition('inView => outOfView', [
        animate('500ms ease-out')
      ]),
      transition('outOfView => inView', [
        animate('500ms ease-out')
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() bgColor: string;
  @Input() message: string;

  animationState = 'outOfView';

  // F-1: maybe a click to go away required option?

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  // https://stackoverflow.com/questions/58994336/trigger-animation-after-page-load-in-angular-8-expressionchangedafterithasbeenc
  ngAfterViewInit(){
    this.animationState = "inView"
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(){
    // I-2
    console.log("destroying notification")
    // this.animationState = "outOfView"; isn't working even when uncommented
  }

  getStyle(){
    return {
      borderRight: `10px solid ${this.bgColor}`
    }
  }

}
