import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCreditNoteItemsComponent } from './create-credit-note-items.component';

describe('CreateCreditNoteItemsComponent', () => {
  let component: CreateCreditNoteItemsComponent;
  let fixture: ComponentFixture<CreateCreditNoteItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCreditNoteItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCreditNoteItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
