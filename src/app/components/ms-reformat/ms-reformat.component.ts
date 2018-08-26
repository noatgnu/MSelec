import { Component, OnInit } from '@angular/core';
import {ElectronService} from "../../providers/electron.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {WebSocketService} from "../../providers/web-socket.service";


@Component({
  selector: 'app-ms-reformat',
  templateUrl: './ms-reformat.component.html',
  styleUrls: ['./ms-reformat.component.scss']
})
export class MsReformatComponent implements OnInit {
  form: FormGroup;
  labels = {ion: '', fdr: '', output: ''};
  private remote;
  constructor(private electron: ElectronService, private _fb: FormBuilder, private webSocket: WebSocketService) {
    this.remote = electron.remote;
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this._fb.group({
      'p': [0.05],
      'ion': [''],
      'fdr': [''],
      'output': ['']
    })
  }

  getPath(event, key) {
    const file = event.target.files[0];
    this.labels[key] = file.path;
    this.form.controls[key].setValue(this.labels[key]);
  }

  clicked(){
    this.webSocket.sendToMain(this.form.value);
    const current = this.remote.getCurrentWindow();
    current.close();
  }
}
