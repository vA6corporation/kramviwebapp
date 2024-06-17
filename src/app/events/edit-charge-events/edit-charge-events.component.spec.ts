import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChargeEventsComponent } from './edit-charge-events.component';

describe('EditChargeEventsComponent', () => {
  let component: EditChargeEventsComponent;
  let fixture: ComponentFixture<EditChargeEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditChargeEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChargeEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
