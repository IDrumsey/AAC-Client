import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Tool } from 'src/app/models/tool';

@Component({
  selector: 'app-admin-tool-bar',
  templateUrl: './admin-tool-bar.component.html',
  styleUrls: ['./admin-tool-bar.component.css']
})
export class AdminToolBarComponent implements OnInit {
  showing: boolean = true;
  @Output() addAnimalBtnClickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateAnimalBtnClickEvent: EventEmitter<any> = new EventEmitter<any>();

  tools: Tool[] = [
    new Tool("Add animal", () => {this.signalOpenNewAnimalForm(this.addAnimalBtnClickEvent)}),
    new Tool("Update animal's information", () => {this.signalUpdateAnimal(this.updateAnimalBtnClickEvent)})
  ]

  constructor() { }

  ngOnInit(): void {
  }

  toolBtnClick(tool: Tool){
    // call relay
    tool.relay();
  }

  signalOpenNewAnimalForm(eventEmitter: EventEmitter<any>){
    console.log("signaling")
    // this.addAnimalBtnClickEvent.emit();
    eventEmitter.emit();
  }

  signalUpdateAnimal(eventEmitter: EventEmitter<any>){
    // this.updateAnimalBtnClickEvent.emit();
    eventEmitter.emit();
  }
}
