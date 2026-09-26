import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentOrdersComponent } from './create-payment-orders.component';

describe('CreatePaymentOrdersComponent', () => {
  let component: CreatePaymentOrdersComponent;
  let fixture: ComponentFixture<CreatePaymentOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePaymentOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePaymentOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
