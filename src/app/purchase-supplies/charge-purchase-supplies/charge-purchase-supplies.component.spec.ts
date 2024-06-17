import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargePurchaseSuppliesComponent } from './charge-purchase-supplies.component';

describe('ChargePurchaseSuppliesComponent', () => {
  let component: ChargePurchaseSuppliesComponent;
  let fixture: ComponentFixture<ChargePurchaseSuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargePurchaseSuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargePurchaseSuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
