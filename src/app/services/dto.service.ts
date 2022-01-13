import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DtoService {

  constructor() { }

  mapAnonymousToInstance<type>(data: type, instance: type){
    // Object.keys(data).forEach(key => {
    //   if(instance[key]){
    //     instance[key] = data[key];
    //   }
    // })
  }
}
