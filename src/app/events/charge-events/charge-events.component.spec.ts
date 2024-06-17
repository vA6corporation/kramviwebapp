import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeEventsComponent } from './charge-events.component';

describe('ChargeEventsComponent', () => {
  let component: ChargeEventsComponent;
  let fixture: ComponentFixture<ChargeEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
