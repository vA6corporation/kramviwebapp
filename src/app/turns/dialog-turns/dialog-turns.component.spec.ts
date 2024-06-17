import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTurnsComponent } from './dialog-turns.component';

describe('DialogTurnsComponent', () => {
  let component: DialogTurnsComponent;
  let fixture: ComponentFixture<DialogTurnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogTurnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTurnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
