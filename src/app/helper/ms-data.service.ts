import { Injectable } from '@angular/core';
import {MsSpectrum} from './ms-spectrum';
import {MsElement} from './ms-element';
import {BehaviorSubject, Subject} from 'rxjs';
import {D3} from 'd3-ng2-service';
import {MsPeptide} from './ms-peptide';
import {MsProtein} from "./ms-protein";

@Injectable({
  providedIn: 'root'
})
export class MsDataService {
  private viewerData = new BehaviorSubject<MsSpectrum>(null);
  viewerDataReader = this.viewerData.asObservable();
  private peptidesData = new BehaviorSubject<MsPeptide[]>(null);
  peptidesDataReader = this.peptidesData.asObservable();
  private ionsData = new BehaviorSubject<MsElement[]>(null);
  ionsDataReader = this.ionsData.asObservable();
  private sampleData = new BehaviorSubject<MsProtein[]>(null);
  sampleDataReader = this.sampleData.asObservable();
  private saveTrigger = new Subject<boolean>();
  saveTriggerReader = this.saveTrigger.asObservable();
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

  UpdateProteinData(data) {
    this.sampleData.next(data);
  }

  UpdateSaveTrigger(data) {
    this.saveTrigger.next(data);
  }

  GetYAxis(d3: D3, maxHeight: number, maxValue: number) {
    return d3.scaleLinear().range([maxHeight, 0]).domain([0, maxValue]);
  }

  GetXAxis(d3: D3, maxWidth: number, maxValue: number) {
    return d3.scaleLinear().range([0, maxWidth]).domain([0, maxValue]);
  }
}
