import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSaleItemsComponent } from './detail-sale-items.component';

describe('DetailSaleItemsComponent', () => {
  let component: DetailSaleItemsComponent;
  let fixture: ComponentFixture<DetailSaleItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailSaleItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailSaleItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
