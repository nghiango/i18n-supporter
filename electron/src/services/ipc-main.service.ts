import {ipcMain} from 'electron';
import {IpcSignatureEnum} from '../../../global/ipc-signature.enum';
import {FileApiService} from './file-api.service';

const fileApiService = FileApiService.getInstance();
const registerEvents = () => {
  console.log('Class: , Line 7 : Just go here for event');
  ipcMain.on(IpcSignatureEnum.READ_FILE, fileApiService.readFile);
};

export default registerEvents;
