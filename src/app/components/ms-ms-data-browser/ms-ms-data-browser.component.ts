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
import {MsSample} from "../../helper/ms-sample";

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
  ionMap: Map<string, MsSample> = new Map<string, MsSample>();
  Samples: MsSample[] = [];

  constructor(private spectrum: MsDataService, private electron: ElectronService, private fileService: FileService, private webSocket: WebSocketService) {
    this.MsData = this.spectrum.viewerDataReader;
    this.remote = this.electron.remote;
    this.ipcRenderer = this.electron.ipcRenderer;
    this.currentWindow = this.remote.getCurrentWindow();
    this.createMenu();
  }

  ngOnInit() {
    let a = this.ionMap;
    const p = this.Samples;
    this.ipcRenderer.on('msmsfile', function (event, arg) {
      a = new Map<string, MsSample>();
      const e = <MsElement[]>arg;
      for (let i = 0; i < e.length; i++) {
        if (!a.has(e[i].Sample)) {
          const c = new MsSample(e[i].Sample, new Map<string, MsProtein>())
          a.set(e[i].Sample, c);
          p.push(c);
        }
        if (!a.get(e[i].Sample).Proteins.has(e[i].Protein)) {
          a.get(e[i].Sample).Proteins.set(e[i].Protein, new MsProtein( new Map<string, MsPeptide>(), e[i].Protein));
        }
        if (!a.get(e[i].Sample).Proteins.get(e[i].Protein).Peptides.has(e[i].Peptide)) {
          a.get(e[i].Sample).Proteins.get(e[i].Protein).Peptides.set(e[i].Peptide, new MsPeptide(e[i].Peptide, []));
        }
        a.get(e[i].Sample).Proteins.get(e[i].Protein).Peptides.get(e[i].Peptide).Ions.push(e[i]);
      }

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

  chooseSample(sample: MsSample) {
    this.spectrum.UpdateProteinData(Array.from(sample.Proteins.values()));
  }
}
