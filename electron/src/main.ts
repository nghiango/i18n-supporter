import { app, BrowserWindow } from 'electron';
import * as url from 'url';
import { joinPath } from './services/path.service';
import registerEvents from './services/ipc-main.service';

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

  win.loadURL(
    url.format({
      pathname: joinPath(__dirname, `/../../../../dist/i18n-supporter/index.html`),
      protocol: 'file:',
      slashes: true
    })
  );

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}
