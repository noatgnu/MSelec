import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MsReformatComponent } from './components/ms-reformat/ms-reformat.component';

import {WebSocketService} from './providers/web-socket.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatCheckboxModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatCardModule,
  MatListModule,
  MatTableModule, MatSelectModule
} from '@angular/material';
import {FileService} from './providers/file.service';
import { RecentJobsComponent } from './components/recent-jobs/recent-jobs.component';
import {D3Service} from 'd3-ng2-service';
import {MsSpectrumViewerComponent} from './components/ms-spectrum-viewer/ms-spectrum-viewer.component';
import { MsMsDataBrowserComponent } from './components/ms-ms-data-browser/ms-ms-data-browser.component';
import { PeptideBrowserComponent } from './components/ms-ms-data-browser/peptide-browser/peptide-browser.component';
import { IonBrowserComponent } from './components/ms-ms-data-browser/ion-browser/ion-browser.component';
import { ProteinBrowserComponent } from './components/ms-ms-data-browser/protein-browser/protein-browser.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MsSpectrumGraphComponent } from './components/ms-spectrum-viewer/ms-spectrum-graph/ms-spectrum-graph.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    MsReformatComponent,
    RecentJobsComponent,
    MsSpectrumViewerComponent,
    MsMsDataBrowserComponent,
    PeptideBrowserComponent,
    IonBrowserComponent,
    ProteinBrowserComponent,
    MsSpectrumGraphComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [ElectronService, WebSocketService, FileService, D3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
