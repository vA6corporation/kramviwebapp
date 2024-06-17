import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedBoardsComponent } from './deleted-boards.component';

describe('DeletedBoardsComponent', () => {
  let component: DeletedBoardsComponent;
  let fixture: ComponentFixture<DeletedBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletedBoardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
