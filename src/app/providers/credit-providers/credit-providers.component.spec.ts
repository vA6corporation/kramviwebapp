import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditProvidersComponent } from './credit-providers.component';

describe('CreditProvidersComponent', () => {
  let component: CreditProvidersComponent;
  let fixture: ComponentFixture<CreditProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditProvidersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
