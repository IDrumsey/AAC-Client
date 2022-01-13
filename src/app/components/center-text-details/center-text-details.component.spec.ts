import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterTextDetailsComponent } from './center-text-details.component';

describe('CenterTextDetailsComponent', () => {
  let component: CenterTextDetailsComponent;
  let fixture: ComponentFixture<CenterTextDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CenterTextDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterTextDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
