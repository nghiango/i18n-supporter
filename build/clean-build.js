const path = require('path');
const fs = require('fs-extra');

const electronBuildPath = path.join(__dirname, '../electron/dist');
const angularBuildPath = path.join(__dirname, '../dist');
fs.emptyDirSync(electronBuildPath);
fs.emptyDirSync(angularBuildPath);
