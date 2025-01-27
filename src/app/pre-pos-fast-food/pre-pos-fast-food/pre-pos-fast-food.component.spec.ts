import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrePosFastFoodComponent } from './pre-pos-fast-food.component';

describe('PrePosFastFoodComponent', () => {
  let component: PrePosFastFoodComponent;
  let fixture: ComponentFixture<PrePosFastFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrePosFastFoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrePosFastFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
