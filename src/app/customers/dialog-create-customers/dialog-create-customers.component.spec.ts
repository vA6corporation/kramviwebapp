import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateCustomersComponent } from './dialog-create-customers.component';

describe('DialogCreateCustomersComponent', () => {
  let component: DialogCreateCustomersComponent;
  let fixture: ComponentFixture<DialogCreateCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreateCustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
