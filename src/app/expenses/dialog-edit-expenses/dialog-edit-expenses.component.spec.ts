import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditExpensesComponent } from './dialog-edit-expenses.component';

describe('DialogEditExpensesComponent', () => {
  let component: DialogEditExpensesComponent;
  let fixture: ComponentFixture<DialogEditExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditExpensesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
