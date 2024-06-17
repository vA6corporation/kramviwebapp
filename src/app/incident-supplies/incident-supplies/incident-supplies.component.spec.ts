import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentSuppliesComponent } from './incident-supplies.component';

describe('IncidentSuppliesComponent', () => {
  let component: IncidentSuppliesComponent;
  let fixture: ComponentFixture<IncidentSuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentSuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentSuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
