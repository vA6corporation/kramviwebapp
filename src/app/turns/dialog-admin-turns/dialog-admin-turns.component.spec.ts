import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAdminTurnsComponent } from './dialog-admin-turns.component';

describe('DialogAdminTurnsComponent', () => {
  let component: DialogAdminTurnsComponent;
  let fixture: ComponentFixture<DialogAdminTurnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAdminTurnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAdminTurnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
