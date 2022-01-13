import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPicturesFormComponent } from './add-pictures-form.component';

describe('AddPicturesFormComponent', () => {
  let component: AddPicturesFormComponent;
  let fixture: ComponentFixture<AddPicturesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPicturesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPicturesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
