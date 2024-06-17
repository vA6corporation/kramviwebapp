import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRecipeItemsComponent } from './dialog-recipe-items.component';

describe('DialogRecipeItemsComponent', () => {
  let component: DialogRecipeItemsComponent;
  let fixture: ComponentFixture<DialogRecipeItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRecipeItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRecipeItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
