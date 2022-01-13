# Refactoring

## Bloaters

### Long methods -

## 1. _Original_ store-hours.service.ts -> extractStoreHours()

```ts
extractStoreHours(hoursObj: DayOperationHours, rawData: any[]) : DayOperationHours{
    let timesExist: any[] | null = rawData.find(dayHours => dayHours.dayName == hoursObj.day.toString()) // running this expression twice to get around typescript
    if(timesExist == null){
      return hoursObj;
    }

    let dayHours: any[] = rawData.find(dayHours => dayHours.dayName == hoursObj.day.toString()).times

    let open = dayHours.find(time => time.intervalSideName == "open");
    let close = dayHours.find(time => time.intervalSideName == "close");

    if(open != null){
      hoursObj.open = new Date();
      hoursObj.open.setHours(open.hours)
      hoursObj.open.setMinutes(open.minutes)
      hoursObj.open.setSeconds(open.seconds)
    }

    if(close != null){
      hoursObj.close = new Date();
      hoursObj.close.setHours(close.hours)
      hoursObj.close.setMinutes(close.minutes)
      hoursObj.close.setSeconds(close.seconds)
    }

    return hoursObj;
  }
```

1. Use the _Replace Temp with Query_ method to extract a method from

```ts
let timesExist: any[] | null = rawData.find(
  (dayHours) => dayHours.dayName == hoursObj.day.toString()
);
```

and

```ts
let dayHours: any[] = rawData.find(
  (dayHours) => dayHours.dayName == hoursObj.day.toString()
).times;
```

to

```ts
extractOpenAndCloseTimesOnDayFromRawData(day: DayNames, rawDataObjectArray: any[]): any[]{
    return rawDataObjectArray.find(dayHours => dayHours.dayName == day.toString()).times;
  }
```

resulting in

```ts
extractStoreHours(hoursObj: DayOperationHours, rawData: any[]) : DayOperationHours{
    let dayOpenAndCloseTimeObjects: any[] | null = this.extractOpenAndCloseTimesOnDayFromRawData(hoursObj.day, rawData) // running this expression twice to get around typescript

    if(dayOpenAndCloseTimeObjects == null){
      return hoursObj;
    }

    let open = dayOpenAndCloseTimeObjects.find(time => time.intervalSideName == "open");
    let close = dayOpenAndCloseTimeObjects.find(time => time.intervalSideName == "close");

    if(open != null){
      hoursObj.open = new Date();
      hoursObj.open.setHours(open.hours)
      hoursObj.open.setMinutes(open.minutes)
      hoursObj.open.setSeconds(open.seconds)
    }

    if(close != null){
      hoursObj.close = new Date();
      hoursObj.close.setHours(close.hours)
      hoursObj.close.setMinutes(close.minutes)
      hoursObj.close.setSeconds(close.seconds)
    }

    return hoursObj;
  }

  extractOpenAndCloseTimesOnDayFromRawData(day: DayNames, rawDataObjectArray: any[]): any[]{
    return rawDataObjectArray.find(dayHours => dayHours.dayName == day.toString()).times;
  }
```

2. Use the _Replace Temp with Query_ to extract two methods for each

```ts
let open = dayOpenAndCloseTimeObjects.find(
  (time) => time.intervalSideName == "open"
);
```

and

```ts
let close = dayOpenAndCloseTimeObjects.find(
  (time) => time.intervalSideName == "close"
);
```

extracted methods -

```ts
extractOpenTimeFromRawDayOpenAndCloseTimes(dayOpenAndCloseTimeObjects: any[]){
    return dayOpenAndCloseTimeObjects.find(time => time.intervalSideName == "open");
  }
```

and

```ts
extractCloseTimeFromRawDayOpenAndCloseTimes(dayOpenAndCloseTimeObjects: any[]){
    return dayOpenAndCloseTimeObjects.find(time => time.intervalSideName == "close");
  }
```

to get

```ts
extractStoreHours(hoursObj: DayOperationHours, rawData: any[]) : DayOperationHours{
    let dayOpenAndCloseTimeObjects: any[] | null = this.extractOpenAndCloseTimesOnDayFromRawData(hoursObj.day, rawData) // running this expression twice to get around typescript

    if(dayOpenAndCloseTimeObjects == null){
      return hoursObj;
    }

    let open = this.extractOpenTimeFromRawDayOpenAndCloseTimes(dayOpenAndCloseTimeObjects);
    let close = this.extractCloseTimeFromRawDayOpenAndCloseTimes(dayOpenAndCloseTimeObjects);

    if(open != null){
      hoursObj.open = new Date();
      hoursObj.open.setHours(open.hours)
      hoursObj.open.setMinutes(open.minutes)
      hoursObj.open.setSeconds(open.seconds)
    }

    if(close != null){
      hoursObj.close = new Date();
      hoursObj.close.setHours(close.hours)
      hoursObj.close.setMinutes(close.minutes)
      hoursObj.close.setSeconds(close.seconds)
    }

    return hoursObj;
  }

  extractOpenAndCloseTimesOnDayFromRawData(day: DayNames, rawDataObjectArray: any[]): any[]{
    return rawDataObjectArray.find(dayHours => dayHours.dayName == day.toString()).times;
  }

  extractOpenTimeFromRawDayOpenAndCloseTimes(dayOpenAndCloseTimeObjects: any[]){
    return dayOpenAndCloseTimeObjects.find(time => time.intervalSideName == "open");
  }

  extractCloseTimeFromRawDayOpenAndCloseTimes(dayOpenAndCloseTimeObjects: any[]){
    return dayOpenAndCloseTimeObjects.find(time => time.intervalSideName == "close");
  }
```

3. Use the _Extract_ method to outsource the setting of a Date object for this chunk of code

```ts
if (open != null) {
  hoursObj.open = new Date();
  hoursObj.open.setHours(openTimeObject.hours);
  hoursObj.open.setMinutes(openTimeObject.minutes);
  hoursObj.open.setSeconds(openTimeObject.seconds);
}

if (close != null) {
  hoursObj.close = new Date();
  hoursObj.close.setHours(closeTimeObject.hours);
  hoursObj.close.setMinutes(closeTimeObject.minutes);
  hoursObj.close.setSeconds(closeTimeObject.seconds);
}
```

extracted method -

```ts
createDateWithTimeParams(hours?: number, minutes?: number, seconds?: number){
    let time = new Date();
    if(hours){
      time.setHours(hours);
    }
    if(minutes){
      time.setMinutes(minutes);
    }
    if(seconds){
      time.setSeconds(seconds);
    }
    return time;
  }
```

to get -

```ts
extractStoreHours(hoursObj: DayOperationHours, rawData: any[]) : DayOperationHours{
    let dayOpenAndCloseTimeObjects: any[] | null = this.extractOpenAndCloseTimesOnDayFromRawData(hoursObj.day, rawData) // running this expression twice to get around typescript

    if(dayOpenAndCloseTimeObjects == null){
      return hoursObj;
    }

    let openTimeObject = this.extractOpenTimeFromRawDayOpenAndCloseTimes(dayOpenAndCloseTimeObjects);
    let closeTimeObject = this.extractCloseTimeFromRawDayOpenAndCloseTimes(dayOpenAndCloseTimeObjects);

    if(open != null){
      hoursObj.open = this.createDateWithTimeParams(openTimeObject.hours);
    }

    if(close != null){
      hoursObj.close = this.createDateWithTimeParams(closeTimeObject.hours);
    }

    return hoursObj;
}

createDateWithTimeParams(hours?: number, minutes?: number, seconds?: number){
    let time = new Date();
    if(hours){
      time.setHours(hours);
    }
    if(minutes){
      time.setMinutes(minutes);
    }
    if(seconds){
      time.setSeconds(seconds);
    }
    return time;
}
```

## 2. _Original_ forms.service.ts -> fileToFileToUploadFormatAsync()

```ts
private fileToFileToUploadFormatAsync(file: File){
    // https://simon-schraeder.de/posts/filereader-async/
    return new Promise((resolve, reject) => {
      let converted = new FileToUpload();

      // map the data
      converted.name = file.name;
      converted.size = file.size;
      converted.type = file.type;
      converted.lastModified = file.lastModified;

      // filereader for encoding to base64 format
      let fr = new FileReader();

      // load handler
      fr.onload = () => {
        //set base64 property
        converted.asBase64 = fr.result as string;
        resolve(converted);
      }

      fr.readAsDataURL(file);
    })
  }
```

1. Going to use the _extract_ method to create a constructor to define the FileToUpload object's fields instead of defining them manually

the new constructor -

_file-to-upload.ts_

```ts
constructor(name?: string, size?: number, type?: string, lastModified?: number, asBase64?: string){
        if(name){
            this.name = name;
        }
        if(size){
            this.size = size;
        }
        if(type){
            this.type = type;
        }
        if(lastModified){
            this.lastModified = lastModified;
        }
        if(asBase64){
            this.asBase64 = asBase64;
        }
    }
```

Also took away the comments

result -

```ts
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
```

## 3. add-pictures-form.component.ts -> OnSubmit()

Original

```ts
async onSubmit(){
    // prep image files for upload
    let filesToUpload = await this.formService.filesToFileToUploadFormatAsync(this.selectedFiles);

    // get the store id
    this.activeRoute.params.subscribe(params => {
      let storeId = params["centerId"]

      // need to wait for storeId :/
      this.dataService.addStorePictures(storeId, filesToUpload as FileToUpload[]).subscribe(updatedStore => {
        // successful response -> update store picture gallery
        this.signalPicturesAdded(updatedStore.pictures);
        // add success notification
        let note = this.noteFactory.genSuccessNotification("Pictures added!");
        this.noteService.addNotification(note);

        // close form
        this.signalClose();
      },
      err => {
        if(err.status == 401){
          // create new authentication error notification
          let note = this.noteFactory.genErrorNotification("You aren't authorized to do this.");
          // add the notification
          this.noteService.addNotification(note);
        }
      })
    })
  }
```

I'm going to try to outsource the callback functionality because its te only code that has multiple lines that isn't awaiting responses

here's the first new method for when the api responds successfully

```ts
onSuccessfulSubmitResponse(updatedStore: Store){
    this.signalPicturesAdded(updatedStore.pictures);
    this.noteService.addNotification(this.noteFactory.genSuccessNotification("Pictures added!"));
    this.signalClose();
  }
```

and here's when it is a failed response

```ts
onFailedSubmitResponse(err: any){
    if(err.status == 401){
      this.noteService.addNotification(this.noteFactory.genErrorNotification("You aren't authorized to do this."));
    }
  }
```

to get -

```ts
async onSubmit(){
    // prep image files for upload
    let filesToUpload = await this.formService.filesToFileToUploadFormatAsync(this.selectedFiles);

    // get the store id
    this.activeRoute.params.subscribe(params => {
      let storeId = params["centerId"]

      // need to wait for storeId :/
      this.dataService.addStorePictures(storeId, filesToUpload as FileToUpload[]).subscribe(updatedStore => {
        this.onSuccessfulSubmitResponse(updatedStore);
      },
      err => {
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
```
