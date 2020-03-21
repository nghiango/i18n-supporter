import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {IpcRendererService} from './ipc-renderer.service';
import {IpcSignatureEnum} from '../../../global/ipc-signature.enum';

@Injectable()
export class FileService {

  constructor(
    private ipcRendererService: IpcRendererService
  ) {}

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

  public readFile(file: File): Promise<any> {
    this.ipcRendererService.sendRequest(IpcSignatureEnum.READ_FILE, file);
    return this.ipcRendererService.getResponse(IpcSignatureEnum.READ_FILE_RESPONSE);
  }
}
