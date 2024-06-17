import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPurchaseSupplyItemsComponent } from './dialog-purchase-supply-items.component';

describe('DialogPurchaseSupplyItemsComponent', () => {
  let component: DialogPurchaseSupplyItemsComponent;
  let fixture: ComponentFixture<DialogPurchaseSupplyItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPurchaseSupplyItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPurchaseSupplyItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
