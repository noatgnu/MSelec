import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsMsDataBrowserComponent } from './ms-ms-data-browser.component';

describe('MsMsDataBrowserComponent', () => {
  let component: MsMsDataBrowserComponent;
  let fixture: ComponentFixture<MsMsDataBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsMsDataBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsMsDataBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
