import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeEditPurchasesComponent } from './charge-edit-purchases.component';

describe('ChargeEditPurchasesComponent', () => {
  let component: ChargeEditPurchasesComponent;
  let fixture: ComponentFixture<ChargeEditPurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeEditPurchasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeEditPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
