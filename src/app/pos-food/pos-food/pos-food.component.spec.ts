import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosFoodComponent } from './pos-food.component';

describe('PosFoodComponent', () => {
  let component: PosFoodComponent;
  let fixture: ComponentFixture<PosFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosFoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
