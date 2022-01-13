import { TestBed } from '@angular/core/testing';

import { AnimalEventsService } from './animal-events.service';

describe('AnimalEventsService', () => {
  let service: AnimalEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimalEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
