import { TestBed } from '@angular/core/testing';

import { InventorySuppliesService } from './inventory-supplies.service';

describe('InventorySuppliesService', () => {
  let service: InventorySuppliesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventorySuppliesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
