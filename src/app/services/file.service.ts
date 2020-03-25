import {Injectable} from '@angular/core';
import {IpcRendererService} from './ipc-renderer.service';
import {IpcSignatureEnum} from '../../../global/ipc-signature.enum';

@Injectable()
export class FileService {

  constructor(
    private ipcRendererService: IpcRendererService
  ) {}

  public readFile(filePath: string): Promise<any> {
    this.ipcRendererService.sendRequest(IpcSignatureEnum.READ_FILE, filePath);
    return this.ipcRendererService.getResponse(IpcSignatureEnum.READ_FILE_RESPONSE);
  }

  public readFolder(): Promise<any> {
    return null;
  }

  public saveFile(data: Object) {
    this.ipcRendererService.sendRequest(IpcSignatureEnum.SAVE_FILE, data);
  }
}
