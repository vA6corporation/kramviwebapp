import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosRoomsComponent } from './pos-rooms.component';

describe('PosRoomsComponent', () => {
  let component: PosRoomsComponent;
  let fixture: ComponentFixture<PosRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosRoomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
