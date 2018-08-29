import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IonBrowserComponent } from './ion-browser.component';

describe('IonBrowserComponent', () => {
  let component: IonBrowserComponent;
  let fixture: ComponentFixture<IonBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IonBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IonBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
