import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCouponsComponent } from './create-coupons.component';

describe('CreateCouponsComponent', () => {
  let component: CreateCouponsComponent;
  let fixture: ComponentFixture<CreateCouponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCouponsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
