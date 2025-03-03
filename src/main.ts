import { app, Tray, Menu, dialog } from 'electron';
import started from 'electron-squirrel-startup';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const apiKey = process.env.ETHERSCAN_APIKEY;
const url = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${apiKey}`;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

app.whenReady().then(() => {
  let tray = null;
  try {
    tray = new Tray(path.join(process.resourcesPath, 'gas.png')); // __dirname or process.resourcesPath
    tray.setTitle('Loading...');
    tray.setContextMenu(
      Menu.buildFromTemplate([{ label: 'Quit', role: 'quit' }])
    );
  } catch (e) {
    dialog.showErrorBox('Error', e.message);
    app.quit();
  }

  const fetchGasPrice = async () => {
    /* eslint-disable no-constant-condition */
    while (1) {
      try {
        const response = await fetch(url);
        const data = await response.json();
        const lowGwei = parseFloat(data.result.SafeGasPrice).toFixed(2);
        const avgGwei = parseFloat(data.result.ProposeGasPrice).toFixed(2);
        const highGwei = parseFloat(data.result.FastGasPrice).toFixed(2);
        tray.setTitle(` ${lowGwei} | ${avgGwei} | ${highGwei}`);
      } catch (e) {
        tray.setTitle('Error');
      }

      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  };

  app.dock.hide();
  fetchGasPrice();
});
