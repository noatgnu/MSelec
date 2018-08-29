import { Component, OnInit } from '@angular/core';
import {MsDataService} from '../../helper/ms-data.service';
import {Observable} from 'rxjs';
import {MsSpectrum} from '../../helper/ms-spectrum';
import {ElectronService} from '../../providers/electron.service';
import {FileService} from '../../providers/file.service';

import {WebSocketService} from '../../providers/web-socket.service';
import {MsElement} from '../../helper/ms-element';
import {MsProtein} from '../../helper/ms-protein';
import {MsPeptide} from '../../helper/ms-peptide';

@Component({
  selector: 'app-ms-ms-data-browser',
  templateUrl: './ms-ms-data-browser.component.html',
  styleUrls: ['./ms-ms-data-browser.component.scss']
})
export class MsMsDataBrowserComponent implements OnInit {
  MsData: Observable<MsSpectrum>;
  private remote;
  private currentWindow;
  private ipcRenderer;
  ionMap: Map<string, MsProtein> = new Map<string, MsProtein>();
  Proteins: MsProtein[] = [];

  constructor(private spectrum: MsDataService, private electron: ElectronService, private fileService: FileService, private webSocket: WebSocketService) {
    this.MsData = this.spectrum.viewerDataReader;
    this.remote = this.electron.remote;
    this.ipcRenderer = this.electron.ipcRenderer;
    this.currentWindow = this.remote.getCurrentWindow();
    this.createMenu();
  }

  ngOnInit() {
    this.ionMap = new Map<string, MsProtein>();
    const a = this.ionMap;
    this.Proteins = [];
    const p = this.Proteins;
    this.ipcRenderer.on('msmsfile', function (event, arg) {
      const e = <MsElement>arg;
      console.log(e);
      if (!a.has(e.Protein)) {
        const c = new MsProtein( new Map<string, MsPeptide>(), e.Protein);
        a.set(e.Protein, c);
        p.push(c);
      }
      if (!a.get(e.Protein).Peptides.has(e.Peptide)) {
        a.get(e.Protein).Peptides.set(e.Peptide, new MsPeptide(e.Peptide, []));
      }
      a.get(e.Protein).Peptides.get(e.Peptide).Ions.push(e);
    });
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
            label: 'Load SWATH Ion File',
            click() {
              pif('swath', a, w);
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
      w.sendForParser({job: 'msmsfile', data: {filePath: picked[0], fileType: fileType}});
    }
  }

  chooseProtein(protein: MsProtein) {
    this.spectrum.UpdatePeptidesData(Array.from(protein.Peptides.values()));
  }
}
