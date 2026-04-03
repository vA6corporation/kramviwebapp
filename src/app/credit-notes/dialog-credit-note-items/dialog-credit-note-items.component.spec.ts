import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreditNoteItemsComponent } from './dialog-credit-note-items.component';

describe('DialogCreditNoteItemsComponent', () => {
  let component: DialogCreditNoteItemsComponent;
  let fixture: ComponentFixture<DialogCreditNoteItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreditNoteItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreditNoteItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
