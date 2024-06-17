import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreatePatientsComponent } from './dialog-create-patients.component';

describe('DialogCreatePatientsComponent', () => {
  let component: DialogCreatePatientsComponent;
  let fixture: ComponentFixture<DialogCreatePatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreatePatientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreatePatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
