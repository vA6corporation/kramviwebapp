import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMinStockProductsComponent } from './dialog-min-stock-products.component';

describe('DialogMinStockProductsComponent', () => {
  let component: DialogMinStockProductsComponent;
  let fixture: ComponentFixture<DialogMinStockProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogMinStockProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogMinStockProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
