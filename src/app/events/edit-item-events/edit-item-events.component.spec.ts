import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemEventsComponent } from './edit-item-events.component';

describe('EditItemEventsComponent', () => {
  let component: EditItemEventsComponent;
  let fixture: ComponentFixture<EditItemEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditItemEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
