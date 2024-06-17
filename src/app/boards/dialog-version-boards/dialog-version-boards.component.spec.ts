import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVersionBoardsComponent } from './dialog-version-boards.component';

describe('DialogVersionBoardsComponent', () => {
  let component: DialogVersionBoardsComponent;
  let fixture: ComponentFixture<DialogVersionBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogVersionBoardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVersionBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
