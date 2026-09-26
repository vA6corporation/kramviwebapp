import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargePurchasesComponent } from './charge-purchases.component';

describe('ChargePurchasesComponent', () => {
  let component: ChargePurchasesComponent;
  let fixture: ComponentFixture<ChargePurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargePurchasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargePurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
