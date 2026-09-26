import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosBoardWaiterComponent } from './pos-board-waiter.component';

describe('PosBoardWaiterComponent', () => {
  let component: PosBoardWaiterComponent;
  let fixture: ComponentFixture<PosBoardWaiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosBoardWaiterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosBoardWaiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
