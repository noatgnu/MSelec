import { Component, OnInit } from '@angular/core';
import {MsDataService} from '../../../helper/ms-data.service';
import {Observable} from 'rxjs';
import {MsElement} from '../../../helper/ms-element';

@Component({
  selector: 'app-ion-browser',
  templateUrl: './ion-browser.component.html',
  styleUrls: ['./ion-browser.component.scss']
})
export class IonBrowserComponent implements OnInit {
  Ions: Observable<MsElement[]>;
  displayedColumns = ['Intensity', 'MZ', 'PrecursorCharge', 'PrecursorMZ', 'FragmentCharge', 'IonType', 'Residue'];
  constructor(private spectrum: MsDataService) {
    this.Ions = this.spectrum.ionsDataReader;
  }

  ngOnInit() {
  }

}
