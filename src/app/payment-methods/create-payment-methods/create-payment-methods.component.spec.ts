import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentMethodsComponent } from './create-payment-methods.component';

describe('CreatePaymentMethodsComponent', () => {
  let component: CreatePaymentMethodsComponent;
  let fixture: ComponentFixture<CreatePaymentMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePaymentMethodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePaymentMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
