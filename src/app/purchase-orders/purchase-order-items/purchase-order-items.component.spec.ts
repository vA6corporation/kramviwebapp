import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderItemsComponent } from './purchase-order-items.component';

describe('PurchaseOrderItemsComponent', () => {
  let component: PurchaseOrderItemsComponent;
  let fixture: ComponentFixture<PurchaseOrderItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
