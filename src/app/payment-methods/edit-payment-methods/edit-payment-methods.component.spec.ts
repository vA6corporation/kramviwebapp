import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaymentMethodsComponent } from './edit-payment-methods.component';

describe('EditPaymentMethodsComponent', () => {
  let component: EditPaymentMethodsComponent;
  let fixture: ComponentFixture<EditPaymentMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPaymentMethodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPaymentMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
