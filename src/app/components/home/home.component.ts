import { Component, OnInit } from '@angular/core';
import {ElectronService} from "../../providers/electron.service";
import {WebSocketService} from "../../providers/web-socket.service";
import {FileService} from '../../providers/file.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private renderer;
  private remote;
  constructor(private electron: ElectronService, private webSocket: WebSocketService, private fileStorage: FileService) { }

  ngOnInit() {
    this.renderer = this.electron.ipcRenderer;
    this.remote = this.electron.remote;

    this.navigation(this.renderer, this.remote);
  }

  private navigation(renderer, remote) {
    renderer.on('nav', function (event, arg) {
      const BrowserWindow = remote.BrowserWindow;
      const win = new BrowserWindow({
        width: 600,
        height: 350,
        center: true,
        resizable: false,
        frame: true,
        transparent: false,
      });
      // win.webContents.openDevTools();
      win.loadURL(`file://${__dirname}/index.html#/${arg}`);
      win.setMenu(null);
    });
  }

}
