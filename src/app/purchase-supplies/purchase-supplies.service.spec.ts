import { TestBed } from '@angular/core/testing';

import { PurchaseSuppliesService } from './purchase-supplies.service';

describe('PurchaseSuppliesService', () => {
  let service: PurchaseSuppliesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseSuppliesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
