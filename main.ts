import { app, BrowserWindow, screen, Menu, ipcMain } from 'electron';
import * as WebSocket from 'ws';
import * as path from 'path';
import * as url from 'url';
import * as child_process from 'child_process';

let parserWS = null;
let ws = null;
let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');
const windowMap = new Map<string, BrowserWindow>();
const be = child_process.spawn(path.resolve(__dirname, 'cmd', '"msWeave.exe"'), [], {shell: true, detached: true});

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

function createMenu(w) {
  const template = [
    {
      label: 'Tool',
      submenu: [
        {
          label: 'MS-Reformat',
          click() {
            navWin('msreformat');
          }
        },
        {
          label: 'MS/MS Data Browser',
          click() {
            navMS();
            //navWin('msmsbrowser');
          }
        }
      ]
    }
  ];
  w.setMenu(Menu.buildFromTemplate(template));
}

function navWin(route) {
  win.webContents.send('nav', route);
}

function navMS() {
  const arg = 'msmsbrowser';
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  const w = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    title: 'msmsfile'
  });
  w.loadURL('file://' + __dirname + '/dist/index.html#' + arg);
  w.webContents.openDevTools();
  windowMap.set('msmsfile', w);
}

function closeWS() {
  if (ws != null) {
    ws.send(JSON.stringify({ event: 'shutdown', msg: {name: 'shutdown', data: {ion: 'test', fdr: 0.005}} }));
    ws.close();
  }
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.getPath('userData');
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
  ws.send(JSON.stringify({event: 'job', msg: {name: arg.job, data: arg.data}}));
});

ipcMain.on('ws-parser', function (event, arg) {
  console.log(arg);
  parserWS.send(JSON.stringify({event: 'job', msg: {name: arg.job, data: arg.data}}));
});


parserWS = new WebSocket('ws://127.0.0.1:8888/csv');
parserWS.on('open', () => {
  console.log('WebSocket Client Connected');
  ws.send(JSON.stringify({ event: 'connected', msg: {name: 'connection', data: true} }));
});
parserWS.on('message', msg => {
  const m = JSON.parse(msg);
  console.log(m);

  windowMap.get(m['msg']['name']).webContents.send(m['msg']['name'], m['msg']['data']);
});

function getWindow(name: string) {
  const windowArray = BrowserWindow.getAllWindows();
  for (let i = 0; i < windowArray.length; i++) {
    if (windowArray[i].getTitle() === 'msmsfile') {
      return windowArray[i];
    }
  }
  return null;
}
