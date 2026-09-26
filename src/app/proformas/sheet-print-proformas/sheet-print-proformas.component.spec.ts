import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetPrintProformasComponent } from './sheet-print-proformas.component';

describe('SheetPrintProformasComponent', () => {
  let component: SheetPrintProformasComponent;
  let fixture: ComponentFixture<SheetPrintProformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetPrintProformasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetPrintProformasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
