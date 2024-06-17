import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargePreSalesComponent } from './charge-pre-sales.component';

describe('ChargePreSalesComponent', () => {
  let component: ChargePreSalesComponent;
  let fixture: ComponentFixture<ChargePreSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargePreSalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargePreSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
