import { ipcMain } from 'electron';
import * as fs from 'fs';

const fileService = () => {
  ipcMain.on('file-readFile', (event, args) => {
    console.log('I want to test');

    console.log(args);
  });
};

export default fileService;
// ipcMain.on('file-read-folder', (event, args) => {

// });
// ipcMain.on('file-write-file', (event, args) => {

// });
