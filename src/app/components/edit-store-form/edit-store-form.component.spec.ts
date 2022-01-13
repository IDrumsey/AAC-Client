import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStoreFormComponent } from './edit-store-form.component';

describe('EditStoreFormComponent', () => {
  let component: EditStoreFormComponent;
  let fixture: ComponentFixture<EditStoreFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStoreFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStoreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
