import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogObservationTurnComponent } from './dialog-observation-turn.component';

describe('DialogObservationTurnComponent', () => {
  let component: DialogObservationTurnComponent;
  let fixture: ComponentFixture<DialogObservationTurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogObservationTurnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogObservationTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
