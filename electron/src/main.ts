import { app, BrowserWindow } from 'electron';
import registerEvents from './services/ipc-main.service';
import {joinPath} from './services/path.service';
import * as url from 'url';

let win: BrowserWindow;

app.on('ready', createWindow);

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
/*
* Register all events of ipcMain to catch event from angular
*/
registerEvents();

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 768,
    webPreferences: { nodeIntegration: true }
  });
  if (process.env.DEVELOPMENT_MODE) {
    win.loadURL(
      'http://localhost:4201'
    );
  } else {
    win.loadURL(
      url.format({
        pathname: joinPath(__dirname, `/../../../../dist/i18n-supporter/index.html`),
        protocol: 'file:',
        slashes: true
      })
    );
  }
  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}
