import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreatePaymentPurchasesComponent } from './dialog-create-payment-purchases.component';

describe('DialogCreatePaymentPurchasesComponent', () => {
  let component: DialogCreatePaymentPurchasesComponent;
  let fixture: ComponentFixture<DialogCreatePaymentPurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCreatePaymentPurchasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCreatePaymentPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
