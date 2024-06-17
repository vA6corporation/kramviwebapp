import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditCategoriesComponent } from './dialog-edit-categories.component';

describe('DialogEditCategoriesComponent', () => {
  let component: DialogEditCategoriesComponent;
  let fixture: ComponentFixture<DialogEditCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
