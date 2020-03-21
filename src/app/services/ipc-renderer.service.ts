import {Injectable} from '@angular/core';
import {IpcRenderer} from 'electron';

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

  public sendRequest(eventSignature: string, data): void{
    this.ipcRenderer.send(eventSignature, data);
  }

  public getResponse(eventSignature: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(eventSignature, (event, args) => {
        if (args) {
          resolve(args);
        }
      });
    });
  }
}
