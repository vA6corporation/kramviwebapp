import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaymentOrdersComponent } from './edit-payment-orders.component';

describe('EditPaymentOrdersComponent', () => {
  let component: EditPaymentOrdersComponent;
  let fixture: ComponentFixture<EditPaymentOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPaymentOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPaymentOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
