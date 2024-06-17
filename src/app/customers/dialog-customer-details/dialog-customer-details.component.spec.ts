import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCustomerDetailsComponent } from './dialog-customer-details.component';

describe('DialogCustomerDetailsComponent', () => {
  let component: DialogCustomerDetailsComponent;
  let fixture: ComponentFixture<DialogCustomerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCustomerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
