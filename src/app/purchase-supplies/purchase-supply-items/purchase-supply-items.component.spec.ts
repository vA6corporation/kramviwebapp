import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseSupplyItemsComponent } from './purchase-supply-items.component';

describe('PurchaseSupplyItemsComponent', () => {
  let component: PurchaseSupplyItemsComponent;
  let fixture: ComponentFixture<PurchaseSupplyItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseSupplyItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseSupplyItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
