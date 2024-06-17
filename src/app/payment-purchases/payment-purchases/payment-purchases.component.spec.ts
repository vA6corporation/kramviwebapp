import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPurchasesComponent } from './payment-purchases.component';

describe('PaymentPurchasesComponent', () => {
  let component: PaymentPurchasesComponent;
  let fixture: ComponentFixture<PaymentPurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentPurchasesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
