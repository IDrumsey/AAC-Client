import {Store} from './store.model';
import {Animal} from './animal.model';

export class CenterAnimalsMetaData {
    store: Store;
    animals: Animal[];

    constructor(store: Store, animals: Animal[]){
        this.store = store;
        this.animals = animals;
    }
}
