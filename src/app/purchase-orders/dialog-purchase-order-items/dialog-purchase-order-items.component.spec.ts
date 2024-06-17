import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPurchaseOrderItemsComponent } from './dialog-purchase-order-items.component';

describe('DialogPurchaseOrderItemsComponent', () => {
  let component: DialogPurchaseOrderItemsComponent;
  let fixture: ComponentFixture<DialogPurchaseOrderItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPurchaseOrderItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPurchaseOrderItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
