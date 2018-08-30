import { Component, OnInit } from '@angular/core';
import {ElectronService} from "../../providers/electron.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {WebSocketService} from "../../providers/web-socket.service";
import {FileService} from "../../providers/file.service";


@Component({
  selector: 'app-ms-reformat',
  templateUrl: './ms-reformat.component.html',
  styleUrls: ['./ms-reformat.component.scss']
})
export class MsReformatComponent implements OnInit {
  form: FormGroup;
  labels = {ion: '', fdr: '', output: ''};
  private remote;
  constructor(private electron: ElectronService, private _fb: FormBuilder, private webSocket: WebSocketService, private fileService: FileService) {
    this.remote = electron.remote;
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this._fb.group({
      'p': ['0.05'],
      'ion': [''],
      'fdr': [''],
      'output': ['']
    })
  }

  getPath(event, key) {
    const file = event.target.files[0];
    this.labels[key] = file.name;
    this.form.controls[key].setValue(file.path);
  }

  clicked(){
    this.webSocket.sendToMain({job: 'msreformat', data: this.form.value});
    const current = this.remote.getCurrentWindow();
    // current.close();
  }

  pickOpenFile(key){
    const picked = this.fileService.pickFile();
    if (picked !== undefined) {
      this.labels[key] = picked[0].split(/.*[\/|\\]/)[1];
      this.form.controls[key].setValue(picked[0]);
    }
  }

  pickSaveFile(key){
    const picked = this.fileService.save();
    if (picked !== undefined) {
      this.labels[key] = picked.split(/.*[\/|\\]/)[1];
      this.form.controls[key].setValue(picked);
    }
  }
}
