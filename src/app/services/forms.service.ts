import { Injectable } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DataAccessService} from './data-access.service';
import {FileToUpload} from '../models/file-to-upload';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(private apiService : DataAccessService) { }

  async filesToFileToUploadFormatAsync(files: FileList){
    let convertedFiles = [];

    for(let i = 0; i < files.length; i++){
      // convert to FileToUpload object
      let converted = await this.fileToFileToUploadFormatAsync(files.item(i) as File);
      convertedFiles.push(converted);
    }

    return convertedFiles;
  }

  private fileToFileToUploadFormatAsync(file: File){
    // https://simon-schraeder.de/posts/filereader-async/
    return new Promise((resolve, reject) => {
      let converted = new FileToUpload(file.name, file.size, file.type, file.lastModified)

      let fr = new FileReader();

      fr.onload = () => {
        converted.asBase64 = fr.result as string;
        resolve(converted);
      }

      fr.readAsDataURL(file);
    })
  }
}
