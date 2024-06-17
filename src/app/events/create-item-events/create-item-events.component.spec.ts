import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemEventsComponent } from './create-item-events.component';

describe('CreateItemEventsComponent', () => {
  let component: CreateItemEventsComponent;
  let fixture: ComponentFixture<CreateItemEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateItemEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateItemEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
