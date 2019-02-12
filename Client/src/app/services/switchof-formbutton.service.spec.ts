import { TestBed, inject } from '@angular/core/testing';

import { SwitchofFormbuttonService } from './switchof-formbutton.service';

describe('SwitchofFormbuttonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SwitchofFormbuttonService]
    });
  });

  it('should be created', inject([SwitchofFormbuttonService], (service: SwitchofFormbuttonService) => {
    expect(service).toBeTruthy();
  }));
});
