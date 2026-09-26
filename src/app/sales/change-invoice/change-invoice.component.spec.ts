import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeInvoiceComponent } from './change-invoice.component';

describe('ChangeInvoiceComponent', () => {
  let component: ChangeInvoiceComponent;
  let fixture: ComponentFixture<ChangeInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
