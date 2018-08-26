import { Injectable } from '@angular/core';
import {ElectronService} from "./electron.service";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ipcRenderer;

  constructor(private electron: ElectronService) {
    this.ipcRenderer = electron.ipcRenderer;
  }

  sendToMain(msg) {
    this.ipcRenderer.send('ws', msg)
  }
}
