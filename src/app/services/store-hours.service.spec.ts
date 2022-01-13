import { TestBed } from '@angular/core/testing';

import { StoreHoursService } from './store-hours.service';

describe('StoreHoursService', () => {
  let service: StoreHoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreHoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
