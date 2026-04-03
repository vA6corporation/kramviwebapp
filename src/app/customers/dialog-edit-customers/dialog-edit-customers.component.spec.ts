import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditCustomersComponent } from './dialog-edit-customers.component';

describe('DialogEditCustomersComponent', () => {
  let component: DialogEditCustomersComponent;
  let fixture: ComponentFixture<DialogEditCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditCustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
