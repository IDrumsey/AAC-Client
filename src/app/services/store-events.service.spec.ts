import { TestBed } from '@angular/core/testing';

import { StoreEventsService } from './store-events.service';

describe('StoreEventsService', () => {
  let service: StoreEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
