import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetPurchaseItemsComponent } from './sheet-purchase-items.component';

describe('SheetPurchaseItemsComponent', () => {
  let component: SheetPurchaseItemsComponent;
  let fixture: ComponentFixture<SheetPurchaseItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetPurchaseItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetPurchaseItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
