import { TestBed, inject } from '@angular/core/testing';

import { UpdatestatustableService } from './updatestatustable.service';

describe('UpdatestatustableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdatestatustableService]
    });
  });

  it('should be created', inject([UpdatestatustableService], (service: UpdatestatustableService) => {
    expect(service).toBeTruthy();
  }));
});
