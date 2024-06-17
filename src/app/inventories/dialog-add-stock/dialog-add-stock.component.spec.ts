import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddStockComponent } from './dialog-add-stock.component';

describe('DialogAddStockComponent', () => {
  let component: DialogAddStockComponent;
  let fixture: ComponentFixture<DialogAddStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
