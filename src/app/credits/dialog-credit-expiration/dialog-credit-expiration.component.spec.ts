import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreditExpirationComponent } from './dialog-credit-expiration.component';

describe('DialogCreditExpirationComponent', () => {
  let component: DialogCreditExpirationComponent;
  let fixture: ComponentFixture<DialogCreditExpirationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreditExpirationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreditExpirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
