import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentItemsComponent } from './incident-items.component';

describe('IncidentItemsComponent', () => {
  let component: IncidentItemsComponent;
  let fixture: ComponentFixture<IncidentItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
