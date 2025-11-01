import { TestBed } from '@angular/core/testing';

import { CheckserviceabilityService } from './checkserviceability.service';

describe('CheckserviceabilityService', () => {
  let service: CheckserviceabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckserviceabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
