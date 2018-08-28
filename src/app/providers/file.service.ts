import { Injectable } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';
import {ElectronService} from './electron.service';
import {Storage} from '../helper/storage';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  get userDataPath(): string {
    return this._userDataPath;
  }

  set userDataPath(value: string) {
    this._userDataPath = value;
  }


  get settings(): Storage {
    return this._settings;
  }

  set settings(value: Storage) {
    this._settings = value;
  }
  private remote;
  private _userDataPath: string;
  private _recentJob: BehaviorSubject<Storage> = new BehaviorSubject<Storage>(null);
  recentJobReader = this._recentJob.asObservable();
  private _settings: Storage;
  constructor(private electron: ElectronService) {
    this.remote = this.electron.remote;
    this._userDataPath = this.remote.app.getPath('userData');
  }

  getRecentJob() {
    this._recentJob.next(new Storage(path.join(this._userDataPath, 'recentjob.json')));
  }

  getSettings() {
    this._settings = new Storage(path.join(this._userDataPath, '_settings.json'));
  }
}
