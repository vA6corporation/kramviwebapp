import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnPaymentsComponent } from './turn-payments.component';

describe('TurnPaymentsComponent', () => {
  let component: TurnPaymentsComponent;
  let fixture: ComponentFixture<TurnPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
