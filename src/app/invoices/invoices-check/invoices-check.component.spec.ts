import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesCheckComponent } from './invoices-check.component';

describe('InvoicesCheckComponent', () => {
  let component: InvoicesCheckComponent;
  let fixture: ComponentFixture<InvoicesCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicesCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
