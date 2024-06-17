import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePurchaseSuppliesComponent } from './create-purchase-supplies.component';

describe('CreatePurchaseSuppliesComponent', () => {
  let component: CreatePurchaseSuppliesComponent;
  let fixture: ComponentFixture<CreatePurchaseSuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePurchaseSuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePurchaseSuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
