import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCustomersComponent } from './credit-customers.component';

describe('CreditCustomersComponent', () => {
  let component: CreditCustomersComponent;
  let fixture: ComponentFixture<CreditCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
