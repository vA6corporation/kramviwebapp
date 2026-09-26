import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditPaymentsComponent } from './dialog-edit-payments.component';

describe('DialogEditPaymentsComponent', () => {
  let component: DialogEditPaymentsComponent;
  let fixture: ComponentFixture<DialogEditPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
