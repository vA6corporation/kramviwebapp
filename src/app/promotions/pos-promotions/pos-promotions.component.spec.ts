import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosPromotionsComponent } from './pos-promotions.component';

describe('PosPromotionsComponent', () => {
  let component: PosPromotionsComponent;
  let fixture: ComponentFixture<PosPromotionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosPromotionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
