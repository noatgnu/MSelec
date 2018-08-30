import {Component, OnInit, Output} from '@angular/core';
import {FileService} from "../../providers/file.service";
import {WebSocketService} from "../../providers/web-socket.service";
import {MsDataService} from "../../helper/ms-data.service";


@Component({
  selector: 'app-ms-spectrum-viewer',
  templateUrl: './ms-spectrum-viewer.component.html',
  styleUrls: ['./ms-spectrum-viewer.component.scss']
})
export class MsSpectrumViewerComponent implements OnInit{

  constructor(private fileService: FileService, private webSocket: WebSocketService, private msData: MsDataService) {

  }
  ngOnInit() {

  }

  enableZoom() {

  }

  getSVG(event) {
    const picked = this.fileService.save();
    if (picked !== null) {
      this.webSocket.sendForSavingSVG({job: 'savesvg', data: {filePath: picked, fileContent: event}})
    }
  }

  exportSVG() {
    this.msData.UpdateSaveTrigger(true);
  }

}
