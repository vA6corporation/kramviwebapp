import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSplitBoardsComponent } from './dialog-split-boards.component';

describe('DialogSplitBoardsComponent', () => {
  let component: DialogSplitBoardsComponent;
  let fixture: ComponentFixture<DialogSplitBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSplitBoardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSplitBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
