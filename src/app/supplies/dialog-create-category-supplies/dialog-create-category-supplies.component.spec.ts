import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateCategorySuppliesComponent } from './dialog-create-category-supplies.component';

describe('DialogCreateCategorySuppliesComponent', () => {
  let component: DialogCreateCategorySuppliesComponent;
  let fixture: ComponentFixture<DialogCreateCategorySuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreateCategorySuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateCategorySuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
