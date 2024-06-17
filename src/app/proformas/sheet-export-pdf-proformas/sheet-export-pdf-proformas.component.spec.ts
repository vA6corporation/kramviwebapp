import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetExportPdfProformasComponent } from './sheet-export-pdf-proformas.component';

describe('SheetExportPdfProformasComponent', () => {
  let component: SheetExportPdfProformasComponent;
  let fixture: ComponentFixture<SheetExportPdfProformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetExportPdfProformasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetExportPdfProformasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
