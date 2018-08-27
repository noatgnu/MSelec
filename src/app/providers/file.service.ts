import { Injectable } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';
import {ElectronService} from "./electron.service";
import {Storage} from "../helper/storage";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private remote;
  userDataPath: string;
  recentJob: Storage;
  settings: Storage;
  constructor(private electron: ElectronService) {
    this.remote = this.electron.remote;
    this.userDataPath = this.remote.getPath('userData')
  }

  getRecentJob() {
    this.recentJob = new Storage(path.join(this.userDataPath, 'recentjob.json'))
  }

  getSettings() {
    this.settings = new Storage(path.join(this.userDataPath, 'settings.json'))
  }
}
