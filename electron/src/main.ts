import { app, BrowserWindow } from 'electron';
import * as url from 'url';
import { joinPath } from './services/path.service';
import fileService from './services/file.service';

let win: BrowserWindow;

app.on('ready', createWindow);

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

function createWindow() {
  fileService();
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true }
  });

  win.loadURL(
    url.format({
      pathname: joinPath(__dirname, `/../../dist/i18n-supporter/index.html`),
      protocol: 'file:',
      slashes: true
    })
  );

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}
