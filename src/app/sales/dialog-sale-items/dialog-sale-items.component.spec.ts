import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSaleItemsComponent } from './dialog-sale-items.component';

describe('DialogSaleItemsComponent', () => {
  let component: DialogSaleItemsComponent;
  let fixture: ComponentFixture<DialogSaleItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSaleItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSaleItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
