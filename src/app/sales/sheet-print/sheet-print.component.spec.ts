import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetPrintComponent } from './sheet-print.component';

describe('SheetPrintComponent', () => {
  let component: SheetPrintComponent;
  let fixture: ComponentFixture<SheetPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
