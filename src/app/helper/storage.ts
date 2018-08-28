import * as fs from 'fs';

export class Storage {
  constructor(Path: string) {
    this._Path = Path;
    this._Data = this.LoadData(Path);
  }
  get Path(): string {
    return this._Path;
  }

  set Path(value: string) {
    this._Path = value;
  }

  get Data() {
    return this._Data;
  }

  set Data(value) {
    this._Data = value;
  }
  private _Path: string;
  private _Data;

  LoadData(filePath: string) {
    const path = fs.readFileSync(filePath, 'utf8');
    if (fs.existsSync(path)) {
      return JSON.parse(path);
    } else {
      return null;
    }
  }

  StoreData(filePath: string, data: any) {
    fs.writeFileSync(filePath, JSON.stringify(data));
  }

  SetData(key, value) {
    this.Data[key] = value;
  }

  GetData(key) {
    return this.Data[key];
  }
}
