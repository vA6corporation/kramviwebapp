import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateTransfersComponent } from './dialog-create-transfers.component';

describe('DialogCreateTransfersComponent', () => {
  let component: DialogCreateTransfersComponent;
  let fixture: ComponentFixture<DialogCreateTransfersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCreateTransfersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCreateTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
