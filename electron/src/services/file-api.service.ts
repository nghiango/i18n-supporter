import * as fs from 'fs-extra';
import { BrowserWindow } from 'electron';
import IpcMainEvent = Electron.IpcMainEvent;
import {IpcSignatureEnum} from '../../../global/ipc-signature.enum';
import {IpcData} from '../../../src/app/models/ipc-data';
import {Builder} from '../../../src/app/shared/buider';

export class FileApiService {
  private static fileApiService: FileApiService;
  constructor() {}
  public static getInstance() {
    if (!this.fileApiService) {
      this.fileApiService = new FileApiService();
    }
    return this.fileApiService;
  }

  public readFile(event: IpcMainEvent, ipcData: IpcData) {
    const path = ipcData.data;
    const fileContent = fs.readFileSync(path, 'utf8');

    const ipcDataResponse =
      Builder(IpcData)
        .id(ipcData.id)
        .data(fileContent)
        .build();
    const window = BrowserWindow.fromWebContents(event.sender);
    window.webContents.send(`${IpcSignatureEnum.READ_FILE_RESPONSE}${ipcData.id}`, ipcDataResponse);
  }

  public saveFile(event: IpcMainEvent, ipcData: IpcData) {
    const data = ipcData.data;
    const filePath = data['path'];
    const content = data['content'];
    fs.writeFileSync(filePath, content);
  }
}
