import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetInvoicesComponent } from './sheet-invoices.component';

describe('SheetInvoicesComponent', () => {
  let component: SheetInvoicesComponent;
  let fixture: ComponentFixture<SheetInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetInvoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
