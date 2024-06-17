import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesIndexComponent } from './invoices-index.component';

describe('InvoicesIndexComponent', () => {
  let component: InvoicesIndexComponent;
  let fixture: ComponentFixture<InvoicesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicesIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
