import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogIncidentItemsComponent } from './dialog-incident-items.component';

describe('DialogIncidentItemsComponent', () => {
  let component: DialogIncidentItemsComponent;
  let fixture: ComponentFixture<DialogIncidentItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogIncidentItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogIncidentItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
