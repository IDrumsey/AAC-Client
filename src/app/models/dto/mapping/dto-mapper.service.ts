import { Injectable } from '@angular/core';
import { AnimalDtoMapperService } from './animal-dto-mapper.service';

@Injectable({
  providedIn: 'root'
})
export class DtoMapperService {
  animals: AnimalDtoMapperService;

  constructor(animalMapper: AnimalDtoMapperService) {
    this.animals = animalMapper;
  }
}
