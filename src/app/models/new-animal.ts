import {AnimalData} from './animalData'
import {FileToUpload} from './file-to-upload'

export class NewAnimal {
    animal: AnimalData;
    images: FileToUpload[];

    constructor(animal: AnimalData, images: FileToUpload[]){
        this.animal = animal;
        this.images = images;
    }
}
