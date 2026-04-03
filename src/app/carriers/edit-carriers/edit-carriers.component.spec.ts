import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCarriersComponent } from './edit-carriers.component';

describe('EditCarriersComponent', () => {
  let component: EditCarriersComponent;
  let fixture: ComponentFixture<EditCarriersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCarriersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCarriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
