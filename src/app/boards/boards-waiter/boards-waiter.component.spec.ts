import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardsWaiterComponent } from './boards-waiter.component';

describe('BoardsWaiterComponent', () => {
  let component: BoardsWaiterComponent;
  let fixture: ComponentFixture<BoardsWaiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardsWaiterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardsWaiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
