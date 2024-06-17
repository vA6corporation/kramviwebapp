import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCreditNotesComponent } from './create-credit-notes.component';

describe('CreateCreditNotesComponent', () => {
  let component: CreateCreditNotesComponent;
  let fixture: ComponentFixture<CreateCreditNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCreditNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCreditNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
