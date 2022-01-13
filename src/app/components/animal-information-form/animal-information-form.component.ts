import { Component, OnInit, Output, EventEmitter, SimpleChanges, Input } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Store} from '../../models/store.model';
import {FormsService} from '../../services/forms.service';
import {DataAccessService} from '../../services/data-access.service';
import { FileToUpload } from 'src/app/models/file-to-upload';
import {AnimalData} from '../../models/animalData';
import {NewAnimal} from '../../models/new-animal';
import { Animal } from 'src/app/models/animal.model';
import { PageEventsService } from 'src/app/services/page-events.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationFactory } from 'src/app/factories/notification-factory';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-animal-information-form',
  templateUrl: './animal-information-form.component.html',
  styleUrls: ['./animal-information-form.component.css']
})
export class AnimalInformationFormComponent implements OnInit {
  @Input() animalToLoad: Animal | null;
  @Input() isUpdateVersionOfForm: boolean;
  @Output() animalInfoFormCancelEvent : EventEmitter<any> = new EventEmitter<any>();
  locations: Store[];
  showingCancelConfirmation = false;

  formData = new FormGroup(
    {
      storeId: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      classification: new FormControl(null, [Validators.required]),
      age: new FormControl(null, [Validators.required, Validators.min(0)]),
      breed: new FormControl(null, [Validators.required]),
      gender: new FormControl('female', [Validators.required]),
      weight: new FormControl(null, [Validators.required, Validators.min(0)]),
      height: new FormControl(null, [Validators.required, Validators.min(0)]),
      favoriteToy: new FormControl(null, [Validators.required]),
      favoriteActivity: new FormControl(null, [Validators.required]),
      description: new FormControl(null)
  }
  )

  actualPictures: FileList | null;

  imagePreviews: string[];

  noteFactory: NotificationFactory;

  constructor(private formService : FormsService, private dataService : DataAccessService, private router : Router, private pageEventsService : PageEventsService, private noteService: NotificationService) {
    this.noteFactory = new NotificationFactory(this.noteService);
  }

  ngOnInit(): void {
    this.dataService.getAllStores().then(stores => {
      this.locations = stores;
    })

    this.setFormsDefaultCenter();

    if(this.isUpdateVersionOfForm){
      this.loadSelectedAnimalInfo();
    }

    this.appendPicturesInputField();
  }

  appendPicturesInputField(){
    this.formData.addControl("pictures", new FormControl({value: null, disabled: this.isUpdateVersionOfForm}, [Validators.required]))
  }

  setFormsDefaultCenter(){
    if(this.locations != null){
      if(this.locations.length > 0){
        this.formData.controls["storeId"].setValue(this.locations[0].storeId);
      }
    }
  }

  showCancelConfirmation(){
    this.showingCancelConfirmation = true;
  }

  removeCancelConfirmation(){
    this.showingCancelConfirmation = false;
  }

  cancelBtnClickHandler(){
    // if form has been altered -> show cancel confirmation
    if(this.formData.dirty){
      this.showCancelConfirmation();
    }
    else{
      // form hasn't been altered -> close form
      this.signalCancel();
    }
  }

  onDeleteConfirmationCancel(){
    // close confirmation popup
    this.removeCancelConfirmation();
  }

  onDeleteConfirmationConfirm(){
    // close confirmation popup
    this.removeCancelConfirmation();

    // signal to close form
    this.signalCancel();
  }

  signalCancel(){
    this.animalInfoFormCancelEvent.emit();
  }

  submitBtnClickHandler(){
    let animalData = this.mapFieldsToAnimalDataObject();

    if(!this.isUpdateVersionOfForm){
      this.newAnimalSubmitHandler(animalData);
    }
    else{
      this.dataService.updateAnimal(this.animalToLoad?.animalId as number, animalData).then(updatedAnimal => {
        this.signalApiAnimalUpdated(updatedAnimal);
        this.noteService.addNotification(this.noteFactory.genSuccessNotification(`${animalData.name}'s information updated!`));
      })
    }
  }

  mapFieldsToAnimalDataObject(): AnimalData{
    let animalData = new AnimalData();

    animalData.name = this.formData.controls['name'].value;
    animalData.classificationName = this.formData.controls['classification'].value;
    animalData.age = this.formData.controls['age'].value;
    animalData.gender = this.formData.controls['gender'].value === 'f' ? 'f' : 'm';
    animalData.species = this.formData.controls['breed'].value;
    animalData.heightInches = this.formData.controls['height'].value;
    animalData.weight = this.formData.controls['weight'].value;
    animalData.favoriteToy = this.formData.controls['favoriteToy'].value;
    animalData.favoriteActivity = this.formData.controls['favoriteActivity'].value;
    animalData.favoriteToy = this.formData.controls['favoriteToy'].value;
    animalData.description = this.formData.controls['description'].value;
    animalData.storeId = this.formData.controls['storeId'].value;

    return animalData;
  }

  async newAnimalSubmitHandler(animalData: AnimalData){
    let pictures = await this.formService.filesToFileToUploadFormatAsync(this.actualPictures as FileList);

    let newAnimalData = new NewAnimal(animalData, pictures as FileToUpload[]);

    this.dataService.addNewAnimal(newAnimalData).then(animalAdded => {
      this.signalNewAnimalAddedToApi(animalAdded);
      this.noteService.addNotification(this.noteFactory.genSuccessNotification(`${animalAdded.name} added!`));
    })
  }

  signalNewAnimalAddedToApi(addedAnimal: Animal){
    this.pageEventsService.animalAddedEvent.next(addedAnimal)
  }

  signalApiAnimalUpdated(updatedAnimal: Animal){
    this.pageEventsService.animalDataUpdatedEvent.next(updatedAnimal);
  }

  // listen for input changes
  ngOnChanges(changes: SimpleChanges){
    // if the locations array changes from undefined to having locations, set the default location
    if(changes.locations != null){
      this.setFormsDefaultCenter();
    }
  }

  onFileSelection(event: any){
    // https://www.positronx.io/angular-8-show-image-preview-with-reactive-forms-tutorial/
    this.clearImagePreviews();
    this.actualPictures = this.getFilesFromEvent(event);
    this.processFilesIntoImagePreviews(this.actualPictures as FileList);
  }

  clearImagePreviews(){
    this.imagePreviews = [];
  }

  getFilesFromEvent(event: any){
    return (event.target as HTMLInputElement).files;
  }

  processFilesIntoImagePreviews(files: FileList){
    for(let i = 0; i < files.length || 0; i++){
      let fr = new FileReader();

      fr.onload = () => {
        // add img url to list to display
        this.imagePreviews.push(fr.result as string);
      }

      fr.readAsDataURL(this.actualPictures?.item(i) as File);
    }
  }

  loadSelectedAnimalInfo(){
    console.log("loading in the animals info : ", this.animalToLoad);
    this.formData.controls["storeId"].setValue(this.animalToLoad?.storeId);
    this.formData.controls["name"].setValue(this.animalToLoad?.name);
    this.formData.controls["classification"].setValue(this.animalToLoad?.classificationName);
    this.formData.controls["age"].setValue(this.animalToLoad?.age);
    this.formData.controls["breed"].setValue(this.animalToLoad?.species);
    this.formData.controls["gender"].setValue(this.animalToLoad?.gender == 'm' ? "male" : "female");
    this.formData.controls["weight"].setValue(this.animalToLoad?.weight);
    this.formData.controls["height"].setValue(this.animalToLoad?.heightInches);
    this.formData.controls["favoriteToy"].setValue(this.animalToLoad?.favoriteToy);
    this.formData.controls["favoriteActivity"].setValue(this.animalToLoad?.favoriteActivity);
    this.formData.controls["description"].setValue(this.animalToLoad?.description);
    console.log("pics : ", this.animalToLoad?.pictures)
    this.imagePreviews = this.animalToLoad?.pictures.map(pic => `http://localhost:5000/Images/Animals/${pic.path}`) as string[];
  }

  getSubmitBtnTitle(){
    return this.isUpdateVersionOfForm ? "Update Animal" : "Add Animal"
  }

  routeToAnimalsInfoPage(){
    this.router.navigate(['animals', this.animalToLoad?.animalId])
  }
}
