import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreditNotesComponent } from './dialog-credit-notes.component';

describe('DialogCreditNotesComponent', () => {
  let component: DialogCreditNotesComponent;
  let fixture: ComponentFixture<DialogCreditNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreditNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreditNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
