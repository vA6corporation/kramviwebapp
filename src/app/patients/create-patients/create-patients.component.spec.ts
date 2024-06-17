import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePatientsComponent } from './create-patients.component';

describe('CreatePatientsComponent', () => {
  let component: CreatePatientsComponent;
  let fixture: ComponentFixture<CreatePatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePatientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
