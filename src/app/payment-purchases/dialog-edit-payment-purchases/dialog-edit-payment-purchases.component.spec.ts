import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditPaymentPurchasesComponent } from './dialog-edit-payment-purchases.component';

describe('DialogEditPaymentPurchasesComponent', () => {
  let component: DialogEditPaymentPurchasesComponent;
  let fixture: ComponentFixture<DialogEditPaymentPurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditPaymentPurchasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditPaymentPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
