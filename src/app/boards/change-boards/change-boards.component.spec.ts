import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeBoardsComponent } from './change-boards.component';

describe('ChangeBoardsComponent', () => {
  let component: ChangeBoardsComponent;
  let fixture: ComponentFixture<ChangeBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeBoardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
