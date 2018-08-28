import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentJobsComponent } from './recent-jobs.component';

describe('RecentJobsComponent', () => {
  let component: RecentJobsComponent;
  let fixture: ComponentFixture<RecentJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
