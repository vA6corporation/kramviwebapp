import { TestBed } from '@angular/core/testing';

import { PreSalesService } from './pre-sales.service';

describe('PreSalesService', () => {
  let service: PreSalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreSalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
