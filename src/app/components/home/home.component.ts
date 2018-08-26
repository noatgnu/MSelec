import { Component, OnInit } from '@angular/core';
import {ElectronService} from "../../providers/electron.service";
import {WebSocketService} from "../../providers/web-socket.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private renderer;
  private remote;
  constructor(private electron: ElectronService, private webSocket: WebSocketService) { }

  ngOnInit() {
    this.renderer = this.electron.ipcRenderer;
    this.remote = this.electron.remote;

    this.navigation(this.renderer, this.remote);
  }S

  private navigation(renderer, remote) {
    renderer.on('nav', function (event, arg) {
      const BrowserWindow = remote.BrowserWindow;
      var win = new BrowserWindow({
        width: 500,
        height: 400,
        center: true,
        resizable: false,
        frame: true,
        transparent: false,
      });
      win.loadURL(`file://${__dirname}/index.html#/${arg}`);
      win.setMenu(null);
    })
  }

}
