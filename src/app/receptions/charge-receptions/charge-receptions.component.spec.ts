import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeReceptionsComponent } from './charge-receptions.component';

describe('ChargeReceptionsComponent', () => {
  let component: ChargeReceptionsComponent;
  let fixture: ComponentFixture<ChargeReceptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeReceptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeReceptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
