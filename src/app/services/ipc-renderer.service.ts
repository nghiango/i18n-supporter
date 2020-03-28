import {Injectable} from '@angular/core';
import {IpcRenderer} from 'electron';
import {IpcData} from '../models/ipc-data';

@Injectable({
  providedIn: 'root'
})
export class IpcRendererService {
  private ipcRenderer: IpcRenderer;

  constructor() {
    if ((<any>window).require) {
      try {
        this.ipcRenderer = (<any>window).require('electron').ipcRenderer;
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Could not load electron ipc');
    }
  }

  public sendRequest(eventSignature: string, data: IpcData): void {
    this.ipcRenderer.send(eventSignature, data);
  }

  public getResponse(eventSignature: string, ipcData: IpcData): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`${eventSignature}${ipcData.id}`, (event, response) => {
        if (response) {
          resolve(response.data);
        }
      });
    });
  }
}
