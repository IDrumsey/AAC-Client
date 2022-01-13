import { Animal } from "../local/animal";
import { FileNameDTO } from "./file-name-dto";

export class AnimalDTO {
    animalId: number;
    name: string;
    age: number;
    gender: string;
    classificationName: string;
    species: string;
    heightInches: number;
    weight: number;
    favoriteToy: string;
    favoriteActivity: string;
    description: string;
    storeId: number;
    pictures: FileNameDTO[];

    public mapToLocal(): Animal {
        let localAnimal = new Animal();
        localAnimal.id = this.animalId;
        localAnimal.name = this.name;
        localAnimal.age = this.age;
        localAnimal.gender = this.gender;
        localAnimal.type = this.species;
        localAnimal.breed = this.classificationName;
        localAnimal.height = this.heightInches;
        localAnimal.weight = this.weight;
        localAnimal.favoriteToy = this.favoriteToy;
        localAnimal.favoriteActivity = this.favoriteActivity;
        localAnimal.description = this.description;
        localAnimal.pictures = this.pictures.map(picture => picture.path);
        localAnimal.storeId = this.storeId;

        return localAnimal;
    }
}
