import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCarriersComponent } from './create-carriers.component';

describe('CreateCarriersComponent', () => {
  let component: CreateCarriersComponent;
  let fixture: ComponentFixture<CreateCarriersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCarriersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCarriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
