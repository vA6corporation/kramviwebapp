import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAttachFileComponent } from './dialog-attach-file.component';

describe('DialogAttachFileComponent', () => {
  let component: DialogAttachFileComponent;
  let fixture: ComponentFixture<DialogAttachFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAttachFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAttachFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
