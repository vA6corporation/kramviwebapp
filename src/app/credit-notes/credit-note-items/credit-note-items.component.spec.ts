import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNoteItemsComponent } from './credit-note-items.component';

describe('CreditNoteItemsComponent', () => {
  let component: CreditNoteItemsComponent;
  let fixture: ComponentFixture<CreditNoteItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditNoteItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditNoteItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
