import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPaymentCreditsComponent } from './dialog-payment-credits.component';

describe('DialogPaymentCreditsComponent', () => {
  let component: DialogPaymentCreditsComponent;
  let fixture: ComponentFixture<DialogPaymentCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPaymentCreditsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPaymentCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
