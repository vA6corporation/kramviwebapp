import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailIncidentSuppliesComponent } from './dialog-detail-incident-supplies.component';

describe('DialogDetailIncidentSuppliesComponent', () => {
  let component: DialogDetailIncidentSuppliesComponent;
  let fixture: ComponentFixture<DialogDetailIncidentSuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetailIncidentSuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetailIncidentSuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
