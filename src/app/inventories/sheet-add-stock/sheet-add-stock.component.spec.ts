import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetAddStockComponent } from './sheet-add-stock.component';

describe('SheetAddStockComponent', () => {
  let component: SheetAddStockComponent;
  let fixture: ComponentFixture<SheetAddStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetAddStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetAddStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
