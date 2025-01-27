import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitBoardsComponent } from './split-boards.component';

describe('SplitBoardsComponent', () => {
  let component: SplitBoardsComponent;
  let fixture: ComponentFixture<SplitBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitBoardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplitBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
