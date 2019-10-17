import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';

@Injectable()
export class FileService {

  constructor() { }

  readContentOfFile(file: File) {
    const fileReader = new FileReader();
    const fileSub = new Subject<string>();
    fileReader.onload = (e) => {
      if (typeof fileReader.result === 'string') {
        fileSub.next(fileReader.result);
        fileSub.complete();
      }
    };
    fileReader.readAsText(file);
    return fileSub.asObservable();
  }
}
