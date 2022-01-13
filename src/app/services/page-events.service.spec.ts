import { TestBed } from '@angular/core/testing';

import { PageEventsService } from './page-events.service';

describe('PageEventsService', () => {
  let service: PageEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
