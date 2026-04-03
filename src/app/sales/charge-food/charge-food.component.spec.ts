import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeFoodComponent } from './charge-food.component';

describe('ChargeFoodComponent', () => {
  let component: ChargeFoodComponent;
  let fixture: ComponentFixture<ChargeFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeFoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
