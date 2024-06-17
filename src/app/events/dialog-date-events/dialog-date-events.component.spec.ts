import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDateEventsComponent } from './dialog-date-events.component';

describe('DialogDateEventsComponent', () => {
  let component: DialogDateEventsComponent;
  let fixture: ComponentFixture<DialogDateEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDateEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDateEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
