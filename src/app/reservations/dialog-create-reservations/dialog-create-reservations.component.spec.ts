import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateReservationsComponent } from './dialog-create-reservations.component';

describe('DialogCreateReservationsComponent', () => {
  let component: DialogCreateReservationsComponent;
  let fixture: ComponentFixture<DialogCreateReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCreateReservationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCreateReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
