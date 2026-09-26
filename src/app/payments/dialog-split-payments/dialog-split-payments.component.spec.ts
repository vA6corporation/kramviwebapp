import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSplitPaymentsComponent } from './dialog-split-payments.component';

describe('DialogSplitPaymentsComponent', () => {
  let component: DialogSplitPaymentsComponent;
  let fixture: ComponentFixture<DialogSplitPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSplitPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSplitPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
