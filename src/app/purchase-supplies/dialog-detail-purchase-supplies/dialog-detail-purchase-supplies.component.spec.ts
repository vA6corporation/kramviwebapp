import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailPurchaseSuppliesComponent } from './dialog-detail-purchase-supplies.component';

describe('DialogDetailPurchaseSuppliesComponent', () => {
  let component: DialogDetailPurchaseSuppliesComponent;
  let fixture: ComponentFixture<DialogDetailPurchaseSuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetailPurchaseSuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetailPurchaseSuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
