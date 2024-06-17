import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeEditMovesComponent } from './charge-edit-moves.component';

describe('ChargeEditMovesComponent', () => {
  let component: ChargeEditMovesComponent;
  let fixture: ComponentFixture<ChargeEditMovesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeEditMovesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeEditMovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
