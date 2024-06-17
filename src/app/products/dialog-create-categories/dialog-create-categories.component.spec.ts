import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateCategoriesComponent } from './dialog-create-categories.component';

describe('DialogCreateCategoriesComponent', () => {
  let component: DialogCreateCategoriesComponent;
  let fixture: ComponentFixture<DialogCreateCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreateCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
