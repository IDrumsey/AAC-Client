import { Component, OnInit, Input } from '@angular/core';
import {Animal} from '../../models/animal.model';

@Component({
  selector: 'app-animal-card',
  templateUrl: './animal-card.component.html',
  styleUrls: ['./animal-card.component.css']
})
export class AnimalCardComponent implements OnInit {
  @Input() animal: Animal;
  picturePath: string;

  constructor() { }

  ngOnInit(): void {
    this.picturePath = this.animal.pictures[0].path;
  }

}
