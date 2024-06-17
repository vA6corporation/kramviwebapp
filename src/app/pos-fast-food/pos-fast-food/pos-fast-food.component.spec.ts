import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosFastFoodComponent } from './pos-fast-food.component';

describe('PosFastFoodComponent', () => {
  let component: PosFastFoodComponent;
  let fixture: ComponentFixture<PosFastFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosFastFoodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosFastFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
