import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosMovesComponent } from './pos-moves.component';

describe('PosMovesComponent', () => {
  let component: PosMovesComponent;
  let fixture: ComponentFixture<PosMovesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosMovesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosMovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
