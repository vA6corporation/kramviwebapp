import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddPrintersComponent } from './dialog-add-printers.component';

describe('DialogAddPrintersComponent', () => {
  let component: DialogAddPrintersComponent;
  let fixture: ComponentFixture<DialogAddPrintersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddPrintersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddPrintersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
