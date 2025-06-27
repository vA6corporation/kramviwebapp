import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeOutIncidentsComponent } from './charge-out-incidents.component';

describe('ChargeOutIncidentsComponent', () => {
  let component: ChargeOutIncidentsComponent;
  let fixture: ComponentFixture<ChargeOutIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeOutIncidentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeOutIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
