import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOpenCashComponent } from './dialog-open-cash.component';

describe('DialogOpenCashComponent', () => {
  let component: DialogOpenCashComponent;
  let fixture: ComponentFixture<DialogOpenCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogOpenCashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOpenCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
