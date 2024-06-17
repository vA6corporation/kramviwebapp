import { TestBed } from '@angular/core/testing';

import { IncidentSuppliesService } from './incident-supplies.service';

describe('IncidentSuppliesService', () => {
  let service: IncidentSuppliesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentSuppliesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
