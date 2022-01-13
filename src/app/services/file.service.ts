import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  getFilesFromClientComputer(files: FileList){
    let sources: string[] = [];
    for(let i = 0; i < files.length; i++){
      // create filereader
      let fr = new FileReader();

      // get the source
      fr.readAsDataURL(files?.item(i) as File);

      // handle the result
      fr.onload = () => {
        sources.push(fr.result as string);
      }
    }

    return sources;
  }
}
