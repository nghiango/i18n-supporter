import {FormControl} from '@angular/forms';

export class FileDto {
  fileName: string;
  jsonDictionary: Object;
  nestedJsonContent: Object;
  formControl: FormControl;
  notExisted: boolean;

  constructor(fileName: string, jsonDictionary: Object, formControl: FormControl) {
    this.fileName = fileName;
    this.jsonDictionary = jsonDictionary;
    this.formControl = formControl;
  }
}
