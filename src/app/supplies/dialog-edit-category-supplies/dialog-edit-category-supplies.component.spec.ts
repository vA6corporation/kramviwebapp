import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditCategorySuppliesComponent } from './dialog-edit-category-supplies.component';

describe('DialogEditCategorySuppliesComponent', () => {
  let component: DialogEditCategorySuppliesComponent;
  let fixture: ComponentFixture<DialogEditCategorySuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditCategorySuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditCategorySuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
