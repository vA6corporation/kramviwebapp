import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeEditPurchaseSuppliesComponent } from './charge-edit-purchase-supplies.component';

describe('ChargeEditPurchaseSuppliesComponent', () => {
  let component: ChargeEditPurchaseSuppliesComponent;
  let fixture: ComponentFixture<ChargeEditPurchaseSuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeEditPurchaseSuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeEditPurchaseSuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
