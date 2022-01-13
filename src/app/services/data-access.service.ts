import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

// ----- SERVICES -----
import { StoreHoursService } from './store-hours.service';

// ----- MODELS -----
import {Store} from '../models/store.model';
import {Animal} from '../models/animal.model';
import {FileToUpload} from '../models/file-to-upload';
import {NewAnimal} from '../models/new-animal';
import {AnimalData} from '../models/animalData';
import {UserLogin} from '../models/user-login';
import {AuthenticationResponse} from '../models/authentication-response';
import { UpdateCenter } from '../models/update-center';
import {ApiRequests} from '../models/api-requests';
import {Cache} from '../models/cache';
import { StoreHours } from '../models/store-hours';
import { DayOperationHoursDto } from '../models/day-operation-hours-dto';

import {AnimalDTO} from '../models/dto/animal-dto';
import {Animal as LocalAnimal} from '../models/local/animal';
import { DtoMapperService } from '../models/dto/mapping/dto-mapper.service';

const requestOptions = {
  headers: {"Content-Type": "application/json"},
  withCredentials: true
}

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {
  baseUrl: string = "http://localhost:5000/api";
  cache = new Cache("ApiRequests");

  constructor(private api: HttpClient, private hoursService: StoreHoursService, private dtoMapper: DtoMapperService) {
    this.cache.initFromLocalStorage();
  }

  // ----------------------------------------------------- USER ENDPOINTS ----------------------------------------------------

  login(userToLogin: UserLogin){
    let endpoint = `${this.baseUrl}/users/authenticate`
    return this.api.post<AuthenticationResponse>(endpoint, userToLogin, requestOptions);
  }

  logoutCurrentUser(){
    let endpoint = `${this.baseUrl}/users/logout`
    return this.api.get<string>(endpoint, requestOptions);
  }

  checkIfLoggedIn(){
    console.log("checking if user is logged in")
    let endpoint = `${this.baseUrl}/users/authenticate/check`
    return this.api.get<any>(endpoint, {
      headers: {"Content-Type": "text/plain"},
      withCredentials: true,
      responseType: 'text' as 'json'
    });
  }

  // ----------------------------------------------------- STORE ENDPOINTS ----------------------------------------------------

  getAllStores() : Promise<Store[]> {
    let endpoint = `${this.baseUrl}/stores`;
    let request = new ApiRequests.GetRequest<Store[]>(this.api, endpoint, requestOptions);
    return request.sendAsync(this.cache);
  }

  getStoreById(storeId: number): Promise<Store>{
    let endpoint = `${this.baseUrl}/stores/${storeId}`;
    let request = new ApiRequests.GetRequest<Store>(this.api, endpoint, requestOptions, [`${this.baseUrl}/stores`])
    return request.sendAsync(this.cache);
  }

  async getStoreHours(storeId: number): Promise<StoreHours>{
    let endpoint = `${this.baseUrl}/stores/${storeId}/hours`;
    let request = new ApiRequests.GetRequest<DayOperationHoursDto[]>(this.api, endpoint, requestOptions);
    let dayHoursDTO = await request.sendAsync(this.cache);
    
    return this.hoursService.convertDayOperationHoursDtoToStoreHours(dayHoursDTO);
  }

  getStoreAnimals(storeId: number): Promise<Animal[]> {
    let endpoint = `${this.baseUrl}/stores/${storeId}/animals`;
    let request = new ApiRequests.GetRequest<Animal[]>(this.api, endpoint, requestOptions);
    return request.sendAsync(this.cache);
  }

  addStorePictures(storeId: number, imageFiles: FileToUpload[]): Promise<Store>{
    let endpoint = `${this.baseUrl}/stores/${storeId}/pictures`;
    let request = new ApiRequests.PutRequest<FileToUpload[], Store>(this.api, endpoint, requestOptions, imageFiles, [`${this.baseUrl}/stores`, `${this.baseUrl}/stores/${storeId}`]);
    return request.send(false, this.cache);
  }

  updateStoreDetails(storeId: number, newStoreDetails: UpdateCenter): Promise<Store>{
    let endpoint = `${this.baseUrl}/stores/${storeId}`;
    let request = new ApiRequests.PutRequest<UpdateCenter, Store>(this.api, endpoint, requestOptions, newStoreDetails, [`${this.baseUrl}/stores`, `${this.baseUrl}/stores/${storeId}`, `${this.baseUrl}/stores/${storeId}/hours`]);
    return request.send(true, this.cache);
  }

  // ----------------------------------------------------- ANIMAL ENDPOINTS ----------------------------------------------------

  getAllAnimals(): Promise<Animal[]> {
    let endpoint = `${this.baseUrl}/animals`;
    let request = new ApiRequests.GetRequest<Animal[]>(this.api, endpoint, requestOptions);
    return request.sendAsync(this.cache);
  }

  getAnimalById(animalId: number): Promise<Animal> {
    console.log("calling getAnimalById2");
    this.getAnimalById2(animalId).then(animal => {
      console.log("result : ", animal)
    })
    let endpoint = `${this.baseUrl}/animals/${animalId}`;
    let request = new ApiRequests.GetRequest<Animal>(this.api, endpoint, requestOptions);
    return request.sendAsync(this.cache);
  }

  async getAnimalById2(animalId: number): Promise<LocalAnimal> {
    console.log("running getAnimalById2");
    let endpoint = `${this.baseUrl}/animals/${animalId}`;
    let request = new ApiRequests.GetRequest<AnimalDTO>(this.api, endpoint, requestOptions);
    let dtoResponse = await request.sendAsync();
    let animalFound = this.dtoMapper.animals.toLocal(dtoResponse);
    return animalFound;
  }

  async addNewAnimal(newAnimal: NewAnimal): Promise<Animal>{
    let endpoint = `${this.baseUrl}/animals`;
    let request = new ApiRequests.PostRequest<NewAnimal, Animal>(this.api, endpoint, requestOptions, newAnimal);
    let animalAdded = await request.send(false, this.cache);
    this.cache.clearSpecifiedEndpoint(`${this.baseUrl}/stores/${animalAdded.storeId}/animals`);
    return animalAdded;
  }

  updateAnimal(animalId: number, animal: AnimalData): Promise<Animal> {
    let endpoint = `${this.baseUrl}/animals/${animalId}`;
    let request = new ApiRequests.PutRequest<AnimalData, Animal>(this.api, endpoint, requestOptions, animal, [`${this.baseUrl}/animals`]);
    return request.send(true, this.cache);
  }

  async deleteAnimal(animalId: number): Promise<Animal>{
    let endpoint = `${this.baseUrl}/animals/${animalId}`;
    let request = new ApiRequests.DeleteRequest<Animal>(this.api, endpoint, requestOptions, [`${this.baseUrl}/animals`]);
    let deletedAnimal = await request.send(false, this.cache);
    this.cache.clearSpecifiedEndpoint(`${this.baseUrl}/stores/${deletedAnimal.storeId}/animals`);
    return deletedAnimal;
  }
}
