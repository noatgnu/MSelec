import { Component, OnInit } from '@angular/core';
import {MsDataService} from "../../helper/ms-data.service";
import {Observable} from "rxjs";
import {MsSpectrum} from "../../helper/ms-spectrum";
import {ElectronService} from "../../providers/electron.service";
import {FileService} from "../../providers/file.service";

import {WebSocketService} from "../../providers/web-socket.service";

@Component({
  selector: 'app-ms-ms-data-browser',
  templateUrl: './ms-ms-data-browser.component.html',
  styleUrls: ['./ms-ms-data-browser.component.scss']
})
export class MsMsDataBrowserComponent implements OnInit {
  MsData: Observable<MsSpectrum>;
  private remote;
  private currentWindow;
  constructor(private spectrum: MsDataService, private electron: ElectronService, private fileService: FileService, private webSocket: WebSocketService) {
    this.MsData = this.spectrum.viewerDataReader;
    this.remote = this.electron.remote;
    this.currentWindow = this.remote.getCurrentWindow();
    this.createMenu();
  }

  ngOnInit() {
  }

  createMenu() {
    const pif = this.pickIonFile;
    const a = this.fileService;
    const w = this.webSocket;
    const template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Load File',
            click() {
              pif("swath", a, w)
            }
          }
        ]
      }
    ];

    this.currentWindow.setMenu(this.electron.remote.Menu.buildFromTemplate(template));
  }

  pickIonFile(fileType: string, a, w) {
    const picked = a.pickFile();
    if (picked !== undefined) {
      w.sendToMain({job: 'msmsfile', data: {filePath: picked[0], fileType: fileType}});
    }
  }
}
