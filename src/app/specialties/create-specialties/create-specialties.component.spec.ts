import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpecialtiesComponent } from './create-specialties.component';

describe('CreateSpecialtiesComponent', () => {
  let component: CreateSpecialtiesComponent;
  let fixture: ComponentFixture<CreateSpecialtiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSpecialtiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSpecialtiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
