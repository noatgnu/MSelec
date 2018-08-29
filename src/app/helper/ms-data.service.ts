import { Injectable } from '@angular/core';
import {MsSpectrum} from './ms-spectrum';
import {MsElement} from './ms-element';
import {BehaviorSubject, Subject} from 'rxjs';
import {D3} from 'd3-ng2-service';
import {MsPeptide} from './ms-peptide';

@Injectable({
  providedIn: 'root'
})
export class MsDataService {
  private viewerData = new BehaviorSubject<MsSpectrum>(null);
  viewerDataReader = this.viewerData.asObservable();
  private peptidesData = new Subject<MsPeptide[]>();
  peptidesDataReader = this.peptidesData.asObservable();
  private ionsData = new Subject<MsElement[]>();
  ionsDataReader = this.ionsData.asObservable();
  constructor() { }

  UpdateViewerData(data: MsSpectrum) {
    this.viewerData.next(data);
  }

  UpdatePeptidesData (data) {
    this.peptidesData.next(data);
  }

  UpdateIonData(data) {
    this.ionsData.next(data);
  }

  GetYAxis(d3: D3, maxHeight: number, maxValue: number) {
    return d3.scaleLinear().range([maxHeight, 0]).domain([0, maxValue]);
  }

  GetXAxis(d3: D3, maxWidth: number, maxValue: number) {
    return d3.scaleLinear().range([0, maxWidth]).domain([0, maxValue]);
  }
}
