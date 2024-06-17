import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeRemissionGuidesComponent } from './charge-remission-guides.component';

describe('ChargeRemissionGuidesComponent', () => {
  let component: ChargeRemissionGuidesComponent;
  let fixture: ComponentFixture<ChargeRemissionGuidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeRemissionGuidesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeRemissionGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
