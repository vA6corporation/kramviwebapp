import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeFastFoodComponent } from './charge-fast-food.component';

describe('ChargeFastFoodComponent', () => {
  let component: ChargeFastFoodComponent;
  let fixture: ComponentFixture<ChargeFastFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeFastFoodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeFastFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
