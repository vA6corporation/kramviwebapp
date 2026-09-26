import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangeTurnComponent } from './dialog-change-turn.component';

describe('DialogChangeTurnComponent', () => {
  let component: DialogChangeTurnComponent;
  let fixture: ComponentFixture<DialogChangeTurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogChangeTurnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogChangeTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
