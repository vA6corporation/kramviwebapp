import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateExpensesComponent } from './dialog-create-expenses.component';

describe('DialogCreateExpensesComponent', () => {
  let component: DialogCreateExpensesComponent;
  let fixture: ComponentFixture<DialogCreateExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCreateExpensesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogCreateExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
