import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeptideBrowserComponent } from './peptide-browser.component';

describe('PeptideBrowserComponent', () => {
  let component: PeptideBrowserComponent;
  let fixture: ComponentFixture<PeptideBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeptideBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeptideBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
