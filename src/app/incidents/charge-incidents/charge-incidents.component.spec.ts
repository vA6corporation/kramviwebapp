import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeIncidentsComponent } from './charge-incidents.component';

describe('ChargeIncidentsComponent', () => {
  let component: ChargeIncidentsComponent;
  let fixture: ComponentFixture<ChargeIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeIncidentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
