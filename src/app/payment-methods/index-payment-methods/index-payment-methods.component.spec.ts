import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexPaymentMethodsComponent } from './index-payment-methods.component';

describe('IndexPaymentMethodsComponent', () => {
  let component: IndexPaymentMethodsComponent;
  let fixture: ComponentFixture<IndexPaymentMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexPaymentMethodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexPaymentMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
