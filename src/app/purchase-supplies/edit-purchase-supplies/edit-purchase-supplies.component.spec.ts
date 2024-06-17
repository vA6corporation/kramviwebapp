import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPurchaseSuppliesComponent } from './edit-purchase-supplies.component';

describe('EditPurchaseSuppliesComponent', () => {
  let component: EditPurchaseSuppliesComponent;
  let fixture: ComponentFixture<EditPurchaseSuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPurchaseSuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPurchaseSuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
