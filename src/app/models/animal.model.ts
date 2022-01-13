import {StoredPicture} from './stored-picture';

export class Animal {
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
    pictures: StoredPicture[];
}