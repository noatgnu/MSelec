import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsReformatComponent } from './ms-reformat.component';

describe('MsReformatComponent', () => {
  let component: MsReformatComponent;
  let fixture: ComponentFixture<MsReformatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsReformatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsReformatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
