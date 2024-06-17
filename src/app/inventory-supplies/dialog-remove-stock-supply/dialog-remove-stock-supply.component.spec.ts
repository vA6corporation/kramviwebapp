import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRemoveStockSupplyComponent } from './dialog-remove-stock-supply.component';

describe('DialogRemoveStockSupplyComponent', () => {
  let component: DialogRemoveStockSupplyComponent;
  let fixture: ComponentFixture<DialogRemoveStockSupplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRemoveStockSupplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRemoveStockSupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
