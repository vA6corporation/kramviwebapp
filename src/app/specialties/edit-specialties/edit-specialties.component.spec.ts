import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpecialtiesComponent } from './edit-specialties.component';

describe('EditSpecialtiesComponent', () => {
  let component: EditSpecialtiesComponent;
  let fixture: ComponentFixture<EditSpecialtiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSpecialtiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSpecialtiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
