import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSendEmailComponent } from './dialog-send-email.component';

describe('DialogSendEmailComponent', () => {
  let component: DialogSendEmailComponent;
  let fixture: ComponentFixture<DialogSendEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSendEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSendEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
