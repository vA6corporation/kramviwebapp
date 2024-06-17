import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLastCommandComponent } from './dialog-last-command.component';

describe('DialogLastCommandComponent', () => {
  let component: DialogLastCommandComponent;
  let fixture: ComponentFixture<DialogLastCommandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLastCommandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLastCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
