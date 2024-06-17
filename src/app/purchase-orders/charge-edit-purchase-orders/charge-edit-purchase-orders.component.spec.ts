import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeEditPurchaseOrdersComponent } from './charge-edit-purchase-orders.component';

describe('ChargeEditPurchaseOrdersComponent', () => {
  let component: ChargeEditPurchaseOrdersComponent;
  let fixture: ComponentFixture<ChargeEditPurchaseOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeEditPurchaseOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeEditPurchaseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
