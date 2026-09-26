import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailPurchaseOrdersComponent } from './dialog-detail-purchase-orders.component';

describe('DialogDetailPurchaseOrdersComponent', () => {
  let component: DialogDetailPurchaseOrdersComponent;
  let fixture: ComponentFixture<DialogDetailPurchaseOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetailPurchaseOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetailPurchaseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
