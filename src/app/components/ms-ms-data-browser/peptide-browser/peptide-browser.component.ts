import {Component, Input, OnInit} from '@angular/core';
import {MsPeptide} from '../../../helper/ms-peptide';
import {Observable, Subscription} from 'rxjs';
import {MsDataService} from '../../../helper/ms-data.service';
import {MsSpectrum} from '../../../helper/ms-spectrum';

@Component({
  selector: 'app-peptide-browser',
  templateUrl: './peptide-browser.component.html',
  styleUrls: ['./peptide-browser.component.scss']
})
export class PeptideBrowserComponent implements OnInit {
  Peptide: Observable<MsPeptide[]>;
  constructor(private spectrum: MsDataService) {
    this.Peptide = this.spectrum.peptidesDataReader;
  }

  ngOnInit() {
  }

  choosePeptide(peptide: MsPeptide) {
    this.spectrum.UpdateIonData(peptide.Ions);
    this.spectrum.UpdateViewerData(new MsSpectrum('', peptide.Ions));
  }
}
