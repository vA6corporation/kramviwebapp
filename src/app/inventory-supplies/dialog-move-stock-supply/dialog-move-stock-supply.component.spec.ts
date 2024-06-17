import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMoveStockSupplyComponent } from './dialog-move-stock-supply.component';

describe('DialogMoveStockSupplyComponent', () => {
  let component: DialogMoveStockSupplyComponent;
  let fixture: ComponentFixture<DialogMoveStockSupplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMoveStockSupplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMoveStockSupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
