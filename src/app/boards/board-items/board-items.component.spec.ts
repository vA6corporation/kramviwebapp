import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardItemsComponent } from './board-items.component';

describe('BoardItemsComponent', () => {
  let component: BoardItemsComponent;
  let fixture: ComponentFixture<BoardItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
