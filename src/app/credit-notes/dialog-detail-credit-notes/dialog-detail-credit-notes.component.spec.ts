import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailCreditNotesComponent } from './dialog-detail-credit-notes.component';

describe('DialogDetailCreditNotesComponent', () => {
  let component: DialogDetailCreditNotesComponent;
  let fixture: ComponentFixture<DialogDetailCreditNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetailCreditNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetailCreditNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
