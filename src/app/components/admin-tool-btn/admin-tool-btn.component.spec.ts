import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminToolBtnComponent } from './admin-tool-btn.component';

describe('AdminToolBtnComponent', () => {
  let component: AdminToolBtnComponent;
  let fixture: ComponentFixture<AdminToolBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminToolBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminToolBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
