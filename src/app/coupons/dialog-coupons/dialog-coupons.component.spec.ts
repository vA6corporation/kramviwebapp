import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCouponsComponent } from './dialog-coupons.component';

describe('DialogCouponsComponent', () => {
  let component: DialogCouponsComponent;
  let fixture: ComponentFixture<DialogCouponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCouponsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
