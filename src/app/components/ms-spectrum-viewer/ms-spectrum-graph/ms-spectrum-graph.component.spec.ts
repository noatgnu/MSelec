import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsSpectrumGraphComponent } from './ms-spectrum-graph.component';

describe('MsSpectrumGraphComponent', () => {
  let component: MsSpectrumGraphComponent;
  let fixture: ComponentFixture<MsSpectrumGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsSpectrumGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsSpectrumGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
