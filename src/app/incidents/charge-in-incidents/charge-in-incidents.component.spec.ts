import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeInIncidentsComponent } from './charge-in-incidents.component';

describe('ChargeInIncidentsComponent', () => {
  let component: ChargeInIncidentsComponent;
  let fixture: ComponentFixture<ChargeInIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeInIncidentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeInIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
