import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { IpcRenderer } from 'electron';
import { resolve } from 'url';

@Injectable()
export class FileService {
  private ipc: IpcRenderer;

  constructor() {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Could not load electron ipc');
    }
  }

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

  readFile(file: File) {
    console.log('into this');

    this.ipc.send('file-readFile', 'test');
  }
}
