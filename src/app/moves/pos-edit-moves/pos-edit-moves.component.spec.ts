import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosEditMovesComponent } from './pos-edit-moves.component';

describe('PosEditMovesComponent', () => {
  let component: PosEditMovesComponent;
  let fixture: ComponentFixture<PosEditMovesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosEditMovesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosEditMovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
