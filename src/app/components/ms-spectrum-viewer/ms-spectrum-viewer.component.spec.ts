import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsSpectrumViewerComponent } from './ms-spectrum-viewer.component';

describe('MsSpectrumViewerComponent', () => {
  let component: MsSpectrumViewerComponent;
  let fixture: ComponentFixture<MsSpectrumViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsSpectrumViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsSpectrumViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
