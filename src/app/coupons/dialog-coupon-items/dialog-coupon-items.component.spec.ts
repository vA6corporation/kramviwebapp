import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCouponItemsComponent } from './dialog-coupon-items.component';

describe('DialogCouponItemsComponent', () => {
  let component: DialogCouponItemsComponent;
  let fixture: ComponentFixture<DialogCouponItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCouponItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCouponItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
