import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBoardsComponent } from './dialog-boards.component';

describe('DialogBoardsComponent', () => {
  let component: DialogBoardsComponent;
  let fixture: ComponentFixture<DialogBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogBoardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
