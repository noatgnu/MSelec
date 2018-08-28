import { TestBed, inject } from '@angular/core/testing';

import { MsDataService } from './ms-data.service';

describe('MsDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MsDataService]
    });
  });

  it('should be created', inject([MsDataService], (service: MsDataService) => {
    expect(service).toBeTruthy();
  }));
});
