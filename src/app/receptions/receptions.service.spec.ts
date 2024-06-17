import { TestBed } from '@angular/core/testing';

import { ReceptionsService } from './receptions.service';

describe('ReceptionsService', () => {
  let service: ReceptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
