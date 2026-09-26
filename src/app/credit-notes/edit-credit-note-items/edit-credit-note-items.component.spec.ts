import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreditNoteItemsComponent } from './edit-credit-note-items.component';

describe('EditCreditNoteItemsComponent', () => {
  let component: EditCreditNoteItemsComponent;
  let fixture: ComponentFixture<EditCreditNoteItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCreditNoteItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCreditNoteItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
