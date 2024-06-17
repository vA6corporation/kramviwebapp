import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSuppliesComponent } from './edit-supplies.component';

describe('EditSuppliesComponent', () => {
  let component: EditSuppliesComponent;
  let fixture: ComponentFixture<EditSuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
