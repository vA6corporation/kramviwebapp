import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMoveStockComponent } from './dialog-move-stock.component';

describe('DialogMoveStockComponent', () => {
  let component: DialogMoveStockComponent;
  let fixture: ComponentFixture<DialogMoveStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMoveStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMoveStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
