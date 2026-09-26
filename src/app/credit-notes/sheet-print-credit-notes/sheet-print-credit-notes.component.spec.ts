import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetPrintCreditNotesComponent } from './sheet-print-credit-notes.component';

describe('SheetPrintCreditNotesComponent', () => {
  let component: SheetPrintCreditNotesComponent;
  let fixture: ComponentFixture<SheetPrintCreditNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetPrintCreditNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetPrintCreditNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
