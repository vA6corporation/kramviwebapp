import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCreditBillerComponent } from './create-credit-biller.component';

describe('CreateCreditBillerComponent', () => {
  let component: CreateCreditBillerComponent;
  let fixture: ComponentFixture<CreateCreditBillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCreditBillerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCreditBillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
