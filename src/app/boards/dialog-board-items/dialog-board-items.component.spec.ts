import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBoardItemsComponent } from './dialog-board-items.component';

describe('DialogBoardItemsComponent', () => {
  let component: DialogBoardItemsComponent;
  let fixture: ComponentFixture<DialogBoardItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogBoardItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBoardItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
