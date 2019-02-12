import { TestBed, inject } from '@angular/core/testing';

import { UpdatecurrentviewService } from './updatecurrentview.service';

describe('UpdatecurrentviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdatecurrentviewService]
    });
  });

  it('should be created', inject([UpdatecurrentviewService], (service: UpdatecurrentviewService) => {
    expect(service).toBeTruthy();
  }));
});
