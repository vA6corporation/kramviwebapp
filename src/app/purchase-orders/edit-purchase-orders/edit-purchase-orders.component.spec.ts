import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPurchaseOrdersComponent } from './edit-purchase-orders.component';

describe('EditPurchaseOrdersComponent', () => {
  let component: EditPurchaseOrdersComponent;
  let fixture: ComponentFixture<EditPurchaseOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPurchaseOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPurchaseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
