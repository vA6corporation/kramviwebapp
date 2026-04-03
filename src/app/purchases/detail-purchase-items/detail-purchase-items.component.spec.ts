import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPurchaseItemsComponent } from './detail-purchase-items.component';

describe('DetailPurchaseItemsComponent', () => {
  let component: DetailPurchaseItemsComponent;
  let fixture: ComponentFixture<DetailPurchaseItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPurchaseItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPurchaseItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
