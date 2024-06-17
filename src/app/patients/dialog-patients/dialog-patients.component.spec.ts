import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPatientsComponent } from './dialog-patients.component';

describe('DialogPatientsComponent', () => {
  let component: DialogPatientsComponent;
  let fixture: ComponentFixture<DialogPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPatientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
