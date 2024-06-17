import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPaymentPurchasesComponent } from './dialog-payment-purchases.component';

describe('DialogPaymentPurchasesComponent', () => {
  let component: DialogPaymentPurchasesComponent;
  let fixture: ComponentFixture<DialogPaymentPurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPaymentPurchasesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPaymentPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
