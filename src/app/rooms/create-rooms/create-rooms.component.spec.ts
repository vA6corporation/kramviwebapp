import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoomsComponent } from './create-rooms.component';

describe('CreateRoomsComponent', () => {
  let component: CreateRoomsComponent;
  let fixture: ComponentFixture<CreateRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRoomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
