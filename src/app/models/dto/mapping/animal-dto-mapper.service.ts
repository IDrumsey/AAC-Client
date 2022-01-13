import { Injectable } from '@angular/core';
import { Animal } from '../../local/animal';
import { AnimalDTO } from '../animal-dto';
import { FileNameDTO } from '../file-name-dto';

@Injectable({
  providedIn: 'root'
})
export class AnimalDtoMapperService {

  constructor() { }

  toLocal(dto: AnimalDTO){
    let localAnimal = new Animal();
    localAnimal.id = dto.animalId;
    localAnimal.name = dto.name;
    localAnimal.age = dto.age;
    localAnimal.gender = dto.gender;
    localAnimal.type = dto.species;
    localAnimal.breed = dto.classificationName;
    localAnimal.height = dto.heightInches;
    localAnimal.weight = dto.weight;
    localAnimal.favoriteToy = dto.favoriteToy;
    localAnimal.favoriteActivity = dto.favoriteActivity;
    localAnimal.description = dto.description;
    localAnimal.pictures = dto.pictures.map(picture => picture.path);
    localAnimal.storeId = dto.storeId;

    return localAnimal;
}

toDTO(local: Animal){
    let dtoAnimal = new AnimalDTO();

    dtoAnimal.animalId = local.id;
    dtoAnimal.name = local.name;
    dtoAnimal.age = local.age;
    dtoAnimal.gender = local.gender;
    dtoAnimal.species = local.type;
    dtoAnimal.classificationName = local.breed;
    dtoAnimal.heightInches = local.height;
    dtoAnimal.weight = local.weight;
    dtoAnimal.favoriteToy = local.favoriteToy;
    dtoAnimal.favoriteActivity = local.favoriteActivity;
    dtoAnimal.description = local.description;
    dtoAnimal.pictures = local.pictures.map(path => {
        let file = new FileNameDTO();
        file.path = path;
        return file;
    })
    dtoAnimal.storeId = local.storeId;
}
}
