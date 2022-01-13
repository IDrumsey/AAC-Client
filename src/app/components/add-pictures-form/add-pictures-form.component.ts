import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {faWindowClose} from '@fortawesome/free-solid-svg-icons';
import {faFileImage} from '@fortawesome/free-regular-svg-icons';

// services
import {FormsService} from '../../services/forms.service';
import {FileService} from '../../services/file.service';
import {DataAccessService} from '../../services/data-access.service';
import { FileToUpload } from 'src/app/models/file-to-upload';
import { NotificationService } from 'src/app/services/notification.service';

// factories
import {NotificationFactory} from '../../factories/notification-factory';
import { ActivatedRoute } from '@angular/router';
import { Store } from 'src/app/models/store.model';

@Component({
  selector: 'app-add-pictures-form',
  templateUrl: './add-pictures-form.component.html',
  styleUrls: ['./add-pictures-form.component.css']
})
export class AddPicturesFormComponent implements OnInit {
  selectedFiles: FileList;
  imagePreviews: string[] = [];

  closeBtnIcon = faWindowClose;
  fileIcon = faFileImage;
  isSubmitBtnDisabled: boolean = true;
  isShowingNotification = false;
  noteFactory: NotificationFactory;

  @Input() submitBtnTitle: string;

  // events
  @Output() addPicturesFormCloseEvent = new EventEmitter();
  @Output() picturesAddedEvent = new EventEmitter<any>();

  constructor(private formService: FormsService, private fileService: FileService, private dataService: DataAccessService, private noteService: NotificationService, private activeRoute: ActivatedRoute) {
    this.noteFactory = new NotificationFactory(this.noteService);
  }

  ngOnInit(): void {
  }

  async onSubmit(){
    // prep image files for upload
    let filesToUpload = await this.formService.filesToFileToUploadFormatAsync(this.selectedFiles);

    this.activeRoute.params.subscribe(params => {
      let storeId = params["centerId"]

      this.dataService.addStorePictures(storeId, filesToUpload as FileToUpload[]).then(updatedStore => {
        this.onSuccessfulSubmitResponse(updatedStore);
      }).catch(err => {
        this.onFailedSubmitResponse(err);
      })
    })
  }

  onSuccessfulSubmitResponse(updatedStore: Store){
    this.signalPicturesAdded(updatedStore.pictures);
    this.noteService.addNotification(this.noteFactory.genSuccessNotification("Pictures added!"));
    this.signalClose();
  }

  onFailedSubmitResponse(err: any){
    if(err.status == 401){
      this.noteService.addNotification(this.noteFactory.genErrorNotification("You aren't authorized to do this."));
    }
  }

  onFilesChosen(event: any){
    this.selectedFiles = (event.target as HTMLInputElement).files as FileList;

    // get preview data
    this.imagePreviews = this.fileService.getFilesFromClientComputer(this.selectedFiles);

    // check if there is any selected files
    this.isSubmitBtnDisabled = this.selectedFiles.length == 0;
  }

  signalClose(){
    this.addPicturesFormCloseEvent.emit();
  }

  signalPicturesAdded(picturesAdded: any[]){
    this.picturesAddedEvent.emit(picturesAdded.map(pic => pic.path));
  }

  removeSelectedPicture(event: any){
    // not implemented right now
    console.log("removing : ", event.target);
  }

}
