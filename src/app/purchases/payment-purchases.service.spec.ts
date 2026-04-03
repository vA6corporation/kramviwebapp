import { TestBed } from '@angular/core/testing';

import { PaymentPurchasesService } from './payment-purchases.service';

describe('PaymentPurchasesService', () => {
  let service: PaymentPurchasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentPurchasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
