import { Component, OnInit } from '@angular/core';
import {FileService} from '../../providers/file.service';
import {Storage} from '../../helper/storage';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-recent-jobs',
  templateUrl: './recent-jobs.component.html',
  styleUrls: ['./recent-jobs.component.scss']
})
export class RecentJobsComponent implements OnInit {
  RecentJobs: Observable<Storage>;
  constructor(private fileStorage: FileService) {
    this.RecentJobs = this.fileStorage.recentJobReader;
  }

  ngOnInit() {
  }

}
