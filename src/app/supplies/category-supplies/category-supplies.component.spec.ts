import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySuppliesComponent } from './category-supplies.component';

describe('CategorySuppliesComponent', () => {
  let component: CategorySuppliesComponent;
  let fixture: ComponentFixture<CategorySuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorySuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
