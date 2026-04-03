import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateInvoicesComponent } from './duplicate-invoices.component';

describe('DuplicateInvoicesComponent', () => {
  let component: DuplicateInvoicesComponent;
  let fixture: ComponentFixture<DuplicateInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicateInvoicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplicateInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
