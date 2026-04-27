import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetPurchaseOrdersComponent } from './sheet-purchase-orders.component';

describe('SheetPurchaseOrdersComponent', () => {
  let component: SheetPurchaseOrdersComponent;
  let fixture: ComponentFixture<SheetPurchaseOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetPurchaseOrdersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SheetPurchaseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
