import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePurchaseOrdersComponent } from './create-purchase-orders.component';

describe('CreatePurchaseOrdersComponent', () => {
  let component: CreatePurchaseOrdersComponent;
  let fixture: ComponentFixture<CreatePurchaseOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePurchaseOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePurchaseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
