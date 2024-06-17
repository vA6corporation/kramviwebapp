import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetExportPdfCreditNotesComponent } from './sheet-export-pdf-credit-notes.component';

describe('SheetExportPdfCreditNotesComponent', () => {
  let component: SheetExportPdfCreditNotesComponent;
  let fixture: ComponentFixture<SheetExportPdfCreditNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetExportPdfCreditNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetExportPdfCreditNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
