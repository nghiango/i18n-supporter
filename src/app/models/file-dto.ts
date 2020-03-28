import {FormControl} from '@angular/forms';

export class FileDto {
  fileName: string;
  path: string;
  jsonDictionary: Object;
  nestedJsonContent: Object;
  formControl: FormControl;
  notExisted: boolean;

  constructor(path: string, fileName: string, jsonDictionary: Object, formControl: FormControl) {
    this.path = path;
    this.fileName = fileName;
    this.jsonDictionary = jsonDictionary;
    this.formControl = formControl;
  }
}
