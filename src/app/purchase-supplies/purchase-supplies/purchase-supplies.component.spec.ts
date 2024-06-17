import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseSuppliesComponent } from './purchase-supplies.component';

describe('PurchaseSuppliesComponent', () => {
  let component: PurchaseSuppliesComponent;
  let fixture: ComponentFixture<PurchaseSuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseSuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseSuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
