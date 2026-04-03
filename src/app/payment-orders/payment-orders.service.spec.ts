import { TestBed } from '@angular/core/testing';

import { PaymentOrdersService } from './payment-orders.service';

describe('PaymentOrdersService', () => {
  let service: PaymentOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
