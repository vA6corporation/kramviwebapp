import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditPatientsComponent } from './dialog-edit-patients.component';

describe('DialogEditPatientsComponent', () => {
  let component: DialogEditPatientsComponent;
  let fixture: ComponentFixture<DialogEditPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditPatientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
