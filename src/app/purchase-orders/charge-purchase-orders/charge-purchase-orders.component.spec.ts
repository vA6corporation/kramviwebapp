import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargePurchaseOrdersComponent } from './charge-purchase-orders.component';

describe('ChargePurchaseOrdersComponent', () => {
  let component: ChargePurchaseOrdersComponent;
  let fixture: ComponentFixture<ChargePurchaseOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargePurchaseOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargePurchaseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
