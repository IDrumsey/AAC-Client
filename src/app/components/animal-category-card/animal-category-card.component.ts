import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-animal-category-card',
  templateUrl: './animal-category-card.component.html',
  styleUrls: ['./animal-category-card.component.css']
})
export class AnimalCategoryCardComponent implements OnInit {
  @Input() categoryName: string;

  constructor() { }

  ngOnInit(): void {
  }

}
