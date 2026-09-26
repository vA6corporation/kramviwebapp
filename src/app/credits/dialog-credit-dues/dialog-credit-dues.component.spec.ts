import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreditDuesComponent } from './dialog-credit-dues.component';

describe('DialogCreditDuesComponent', () => {
  let component: DialogCreditDuesComponent;
  let fixture: ComponentFixture<DialogCreditDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreditDuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreditDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
