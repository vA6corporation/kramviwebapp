import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPurchaseItemsComponent } from './dialog-purchase-items.component';

describe('DialogPurchaseItemsComponent', () => {
  let component: DialogPurchaseItemsComponent;
  let fixture: ComponentFixture<DialogPurchaseItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPurchaseItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPurchaseItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
