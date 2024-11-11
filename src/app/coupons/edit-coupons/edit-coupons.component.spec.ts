import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCouponsComponent } from './edit-coupons.component';

describe('EditCouponsComponent', () => {
  let component: EditCouponsComponent;
  let fixture: ComponentFixture<EditCouponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCouponsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
