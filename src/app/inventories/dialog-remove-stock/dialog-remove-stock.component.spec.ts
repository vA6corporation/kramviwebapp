import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRemoveStockComponent } from './dialog-remove-stock.component';

describe('DialogRemoveStockComponent', () => {
  let component: DialogRemoveStockComponent;
  let fixture: ComponentFixture<DialogRemoveStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRemoveStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRemoveStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
