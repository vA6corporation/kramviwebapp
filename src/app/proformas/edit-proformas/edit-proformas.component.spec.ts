import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProformasComponent } from './edit-proformas.component';

describe('EditProformasComponent', () => {
  let component: EditProformasComponent;
  let fixture: ComponentFixture<EditProformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProformasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProformasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
