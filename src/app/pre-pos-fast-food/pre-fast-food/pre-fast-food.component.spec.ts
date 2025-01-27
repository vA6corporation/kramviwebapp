import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreFastFoodComponent } from './pre-fast-food.component';

describe('PreFastFoodComponent', () => {
  let component: PreFastFoodComponent;
  let fixture: ComponentFixture<PreFastFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreFastFoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreFastFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
