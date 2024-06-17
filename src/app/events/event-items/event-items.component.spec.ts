import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventItemsComponent } from './event-items.component';

describe('EventItemsComponent', () => {
  let component: EventItemsComponent;
  let fixture: ComponentFixture<EventItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
