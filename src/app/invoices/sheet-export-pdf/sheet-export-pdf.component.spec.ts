import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetExportPdfComponent } from './sheet-export-pdf.component';

describe('SheetExportPdfComponent', () => {
  let component: SheetExportPdfComponent;
  let fixture: ComponentFixture<SheetExportPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetExportPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetExportPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
