import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailSaleItemsComponent } from './dialog-detail-sale-items.component';

describe('DialogDetailSaleItemsComponent', () => {
  let component: DialogDetailSaleItemsComponent;
  let fixture: ComponentFixture<DialogDetailSaleItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDetailSaleItemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDetailSaleItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
