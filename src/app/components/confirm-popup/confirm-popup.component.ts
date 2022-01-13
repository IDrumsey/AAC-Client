import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.css']
})
export class ConfirmPopupComponent implements OnInit {
  @Input() message: string;
  @Output() cancelEvent = new EventEmitter();
  @Output() confirmEvent = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onCancel(){
    this.cancelEvent.emit();
  }

  onConfirm(){
    this.confirmEvent.emit();
  }
}