import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSearchCustomersComponent } from './dialog-search-customers.component';

describe('DialogSearchCustomersComponent', () => {
  let component: DialogSearchCustomersComponent;
  let fixture: ComponentFixture<DialogSearchCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSearchCustomersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSearchCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
