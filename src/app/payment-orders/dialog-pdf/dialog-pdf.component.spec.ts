import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPdfComponent } from './dialog-pdf.component';

describe('DialogPdfComponent', () => {
  let component: DialogPdfComponent;
  let fixture: ComponentFixture<DialogPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
