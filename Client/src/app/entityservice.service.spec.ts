import { TestBed, inject } from '@angular/core/testing';

import { EntityserviceService } from './entityservice.service';

describe('EntityserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EntityserviceService]
    });
  });

  it('should be created', inject([EntityserviceService], (service: EntityserviceService) => {
    expect(service).toBeTruthy();
  }));
});
