import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalCategoryCardComponent } from './animal-category-card.component';

describe('AnimalCategoryCardComponent', () => {
  let component: AnimalCategoryCardComponent;
  let fixture: ComponentFixture<AnimalCategoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimalCategoryCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalCategoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
