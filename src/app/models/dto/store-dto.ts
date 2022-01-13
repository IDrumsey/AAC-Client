import { Store } from "../local/store";
import { LocationPictureDTO } from "./location-picture-dto";

export class StoreDTO {
    StoreId: number;
    address: string;
    pictures: LocationPictureDTO[];

    mapToLocal(): Store {
        let localStore = new Store();
        localStore.id = this.StoreId;
        localStore.address = this.address;
        localStore.pictures = this.pictures.map(picture => picture.path);

        return localStore;
    }
}
