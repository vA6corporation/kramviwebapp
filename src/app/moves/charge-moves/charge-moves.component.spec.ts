import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeMovesComponent } from './charge-moves.component';

describe('ChargeMovesComponent', () => {
  let component: ChargeMovesComponent;
  let fixture: ComponentFixture<ChargeMovesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeMovesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeMovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
