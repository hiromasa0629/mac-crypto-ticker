import { app } from 'electron';
import started from 'electron-squirrel-startup';
import { initGasPriceTray } from './gas';
import { initCryptoPriceTray } from './crypto';

const basePath = process.resourcesPath; // __dirname or process.resourcesPath

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

app.whenReady().then(() => {
  initGasPriceTray(basePath);
  initCryptoPriceTray(basePath);
  app.dock.hide();
});
