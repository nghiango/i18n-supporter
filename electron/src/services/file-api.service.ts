import * as fs from 'fs-extra';
import { BrowserWindow } from 'electron';
import IpcMainEvent = Electron.IpcMainEvent;
import {IpcSignatureEnum} from '../../../global/ipc-signature.enum';

export class FileApiService {
  private static fileApiService: FileApiService;
  constructor() {}
  public static getInstance() {
    if (!this.fileApiService) {
      this.fileApiService = new FileApiService();
    }
    return this.fileApiService;
  }

  public readFile(event: IpcMainEvent, filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const window = BrowserWindow.fromWebContents(event.sender);
    window.webContents.send(IpcSignatureEnum.READ_FILE_RESPONSE, fileContent);
  }

  public readFolder(folderPath: string) {

  }

  public saveFile(event: IpcMainEvent, data) {
    const filePath = data['path'];
    const content = data['content'];
    fs.writeFileSync(filePath, content);
  }
}
