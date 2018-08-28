import { Injectable } from '@angular/core';
import {MsSpectrum} from './ms-spectrum';
import {MsElement} from './ms-element';
import {BehaviorSubject} from 'rxjs';
import {D3} from 'd3-ng2-service';

@Injectable({
  providedIn: 'root'
})
export class MsDataService {
  testData = new MsSpectrum('test', [new MsElement(100, 10, 6, 0), new MsElement(50, 100, 6, 1)]);
  private viewerData = new BehaviorSubject<MsSpectrum>(this.testData);
  viewerDataReader = this.viewerData.asObservable();
  constructor() { }

  UpdateViewerData(data: MsSpectrum) {
    this.viewerData.next(data);
  }

  GetYAxis(d3: D3, maxHeight: number, maxValue: number) {
    return d3.scaleLinear().range([maxHeight, 0]).domain([0, maxValue]);
  }

  GetXAxis(d3: D3, maxWidth: number, maxValue: number) {
    return d3.scaleLinear().range([0, maxWidth]).domain([0, maxValue]);
  }
}
