import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteinBrowserComponent } from './protein-browser.component';

describe('ProteinBrowserComponent', () => {
  let component: ProteinBrowserComponent;
  let fixture: ComponentFixture<ProteinBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProteinBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProteinBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
