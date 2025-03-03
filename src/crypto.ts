import { app, Tray, Menu, dialog } from 'electron';
import path from 'path';

export const initCryptoPriceTray = (basePath: string) => {
  const url = `https://api.g.alchemy.com/prices/v1/tokens/by-symbol?symbols=BTC&symbols=ETH`;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${process.env.ALCHEMY_APIKEY}`,
  };
  let trayBtc = null;
  let trayEth = null;
  try {
    trayEth = new Tray(path.join(basePath, 'ethereum.png'));
    trayEth.setTitle('Loading...');
    trayEth.setContextMenu(
      Menu.buildFromTemplate([{ label: 'Quit', role: 'quit' }])
    );

    trayBtc = new Tray(path.join(basePath, 'bitcoin.png'));
    trayBtc.setTitle('Loading...');
    trayBtc.setContextMenu(
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
        const response = await fetch(url, { headers });
        const data = await response.json();
        trayBtc.setTitle(
          ` ${parseFloat(data.data[0].prices[0].value).toLocaleString('en-US', {
            maximumFractionDigits: 0,
          })}`
        );
        trayEth.setTitle(
          ` ${parseFloat(data.data[1].prices[0].value).toLocaleString('en-US', {
            maximumFractionDigits: 0,
          })}`
        );
      } catch (e) {
        console.log(e);
        trayBtc.setTitle('Error');
        trayEth.setTitle('Error');
      }

      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  };

  fetchPrices();
};
