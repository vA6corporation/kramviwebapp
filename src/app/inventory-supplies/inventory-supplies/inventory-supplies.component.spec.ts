import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySuppliesComponent } from './inventory-supplies.component';

describe('InventorySuppliesComponent', () => {
  let component: InventorySuppliesComponent;
  let fixture: ComponentFixture<InventorySuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventorySuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorySuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
