import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInitPaymentsComponent } from './dialog-init-payments.component';

describe('DialogInitPaymentsComponent', () => {
  let component: DialogInitPaymentsComponent;
  let fixture: ComponentFixture<DialogInitPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogInitPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogInitPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
