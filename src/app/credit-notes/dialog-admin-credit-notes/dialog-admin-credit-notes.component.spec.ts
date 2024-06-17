import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAdminCreditNotesComponent } from './dialog-admin-credit-notes.component';

describe('DialogAdminCreditNotesComponent', () => {
  let component: DialogAdminCreditNotesComponent;
  let fixture: ComponentFixture<DialogAdminCreditNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAdminCreditNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAdminCreditNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
