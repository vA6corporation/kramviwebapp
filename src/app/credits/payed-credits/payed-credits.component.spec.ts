import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayedCreditsComponent } from './payed-credits.component';

describe('PayedCreditsComponent', () => {
  let component: PayedCreditsComponent;
  let fixture: ComponentFixture<PayedCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayedCreditsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayedCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
