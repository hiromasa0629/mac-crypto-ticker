import { app, Tray, Menu, dialog } from 'electron';
import path from 'path';

export const initGasPriceTray = (basePath: string) => {
  const url = `https://api.etherscan.io/api?module=gastracker&action=gasoracle`;
  let tray = null;
  try {
    tray = new Tray(path.join(basePath, 'gas.png'));
    tray.setTitle('Loading...');
    tray.setContextMenu(
      Menu.buildFromTemplate([{ label: 'Quit', role: 'quit' }])
    );
  } catch (e) {
    dialog.showErrorBox('Error', e.message);
    app.quit();
  }

  const fetchPrices = async () => {
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

  fetchPrices();
};
