import { app, BrowserWindow, screen, Menu, ipcMain } from 'electron';
import * as WebSocket from 'ws';
import * as path from 'path';
import * as url from 'url';


let ws = null;
let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');


function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.resolve(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  win.webContents.openDevTools();


  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  createMenu(win);

}

function createMenu(win) {
  const template = [
    {
      label: 'Tool',
      submenu: [
        {
          label: 'MS-Reformat',
          click() {
            navWin('msreformat');
          }
        }
      ]
    }
  ];
  win.setMenu(Menu.buildFromTemplate(template));
}

function navWin(route) {
  win.webContents.send('nav', route)
}

function closeWS() {
  if (ws != null) {
    ws.send(JSON.stringify({ event: 'shutdown', msg: {name: 'shutdown', data:{ion:"test", fdr:0.005}} }));
    ws.close();
  }
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.

  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    closeWS();
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });


} catch (e) {
  // Catch Error
  // throw e;
}
ws = new WebSocket('ws://127.0.0.1:8888/ui');
ws.on('open', () => {
  console.log('WebSocket Client Connected');
  ws.send(JSON.stringify({ event: 'connected', msg: {name: 'connection', data: true} }));
});

ws.on('close', () => {
  console.log('WebSocket Connection Closed');
  app.quit();
});

ws.on('message', msg => {
  console.log('Received: ', msg);
});
console.log('WebSocket Connection Service assigned.');
ipcMain.on('ws-job', function (event, arg) {
  console.log(arg);
  ws.send(JSON.stringify({event: 'job', msg: {name: 'msreformat', data: arg}}))
});