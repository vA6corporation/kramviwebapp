import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeProformasComponent } from './charge-proformas.component';

describe('ChargeProformasComponent', () => {
  let component: ChargeProformasComponent;
  let fixture: ComponentFixture<ChargeProformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeProformasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeProformasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
