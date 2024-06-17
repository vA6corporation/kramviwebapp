import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabledPaymentMethodsComponent } from './disabled-payment-methods.component';

describe('DisabledPaymentMethodsComponent', () => {
  let component: DisabledPaymentMethodsComponent;
  let fixture: ComponentFixture<DisabledPaymentMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisabledPaymentMethodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisabledPaymentMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
