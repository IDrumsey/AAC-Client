import { Component, OnInit, Input } from '@angular/core';
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.css']
})
export class AddButtonComponent implements OnInit {
  // ui state
  plusIcon = faPlusCircle;
  @Input() buttonColor = "#000";
  @Input() buttonSize = "50px";

  constructor() { }

  ngOnInit(): void {
  }

  getBtnStyles(){
    return {
      color: this.buttonColor,
      fontSize: this.buttonSize
    }
  }
}
