import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSearchProductsComponent } from './dialog-search-products.component';

describe('DialogSearchProductsComponent', () => {
  let component: DialogSearchProductsComponent;
  let fixture: ComponentFixture<DialogSearchProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSearchProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSearchProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
