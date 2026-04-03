import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeEditProformasComponent } from './charge-edit-proformas.component';

describe('ChargeEditProformasComponent', () => {
  let component: ChargeEditProformasComponent;
  let fixture: ComponentFixture<ChargeEditProformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeEditProformasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeEditProformasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
