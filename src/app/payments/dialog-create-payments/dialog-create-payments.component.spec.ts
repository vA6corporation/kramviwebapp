import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreatePaymentsComponent } from './dialog-create-payments.component';

describe('DialogCreatePaymentsComponent', () => {
  let component: DialogCreatePaymentsComponent;
  let fixture: ComponentFixture<DialogCreatePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCreatePaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCreatePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
