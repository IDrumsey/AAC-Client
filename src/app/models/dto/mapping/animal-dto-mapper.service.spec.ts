import { TestBed } from '@angular/core/testing';

import { AnimalDtoMapperService } from './animal-dto-mapper.service';

describe('AnimalDtoMapperService', () => {
  let service: AnimalDtoMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimalDtoMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
