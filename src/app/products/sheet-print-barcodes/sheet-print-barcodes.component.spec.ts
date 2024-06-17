import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetPrintBarcodesComponent } from './sheet-print-barcodes.component';

describe('SheetPrintBarcodesComponent', () => {
  let component: SheetPrintBarcodesComponent;
  let fixture: ComponentFixture<SheetPrintBarcodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetPrintBarcodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetPrintBarcodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
