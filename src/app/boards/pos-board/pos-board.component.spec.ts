import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosBoardComponent } from './pos-board.component';

describe('PosBoardComponent', () => {
  let component: PosBoardComponent;
  let fixture: ComponentFixture<PosBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
