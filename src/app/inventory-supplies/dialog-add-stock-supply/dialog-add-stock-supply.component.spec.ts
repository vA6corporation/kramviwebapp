import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddStockSupplyComponent } from './dialog-add-stock-supply.component';

describe('DialogAddStockSupplyComponent', () => {
  let component: DialogAddStockSupplyComponent;
  let fixture: ComponentFixture<DialogAddStockSupplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddStockSupplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddStockSupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
