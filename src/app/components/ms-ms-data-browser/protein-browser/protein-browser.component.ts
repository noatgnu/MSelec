import { Component, OnInit } from '@angular/core';
import {MsDataService} from "../../../helper/ms-data.service";
import {Observable} from "rxjs";
import {MsProtein} from "../../../helper/ms-protein";

@Component({
  selector: 'app-protein-browser',
  templateUrl: './protein-browser.component.html',
  styleUrls: ['./protein-browser.component.scss']
})
export class ProteinBrowserComponent implements OnInit {
  Proteins: Observable<MsProtein[]>;
  constructor(private spectrum: MsDataService) {
    this.Proteins = this.spectrum.sampleDataReader;
  }

  ngOnInit() {
  }

  chooseProtein(protein: MsProtein) {
    this.spectrum.UpdatePeptidesData(Array.from(protein.Peptides.values()))
  }
}
