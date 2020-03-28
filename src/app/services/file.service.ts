import {Injectable} from '@angular/core';
import {IpcRendererService} from './ipc-renderer.service';
import {IpcSignatureEnum} from '../../../global/ipc-signature.enum';
import {buildIpcData} from '../shared/buider';

@Injectable()
export class FileService {

  constructor(
    private ipcRendererService: IpcRendererService
  ) {}

  public readFile(path: string): Promise<any> {
    const ipcData = buildIpcData(path);
    this.ipcRendererService.sendRequest(IpcSignatureEnum.READ_FILE, ipcData);
    return this.ipcRendererService.getResponse(IpcSignatureEnum.READ_FILE_RESPONSE, ipcData);
  }

  public readFolder(): Promise<any> {
    return null;
  }

  public saveFile(data: Object) {
    const ipcData = buildIpcData(data);
    this.ipcRendererService.sendRequest(IpcSignatureEnum.SAVE_FILE, ipcData);
  }
}
