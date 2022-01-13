import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalInformationFormComponent } from './animal-information-form.component';

describe('AnimalInformationFormComponent', () => {
  let component: AnimalInformationFormComponent;
  let fixture: ComponentFixture<AnimalInformationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimalInformationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
