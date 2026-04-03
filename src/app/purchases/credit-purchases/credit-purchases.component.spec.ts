import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPurchasesComponent } from './credit-purchases.component';

describe('CreditPurchasesComponent', () => {
  let component: CreditPurchasesComponent;
  let fixture: ComponentFixture<CreditPurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditPurchasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
