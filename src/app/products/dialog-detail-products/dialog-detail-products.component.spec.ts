import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailProductsComponent } from './dialog-detail-products.component';

describe('DialogDetailProductsComponent', () => {
  let component: DialogDetailProductsComponent;
  let fixture: ComponentFixture<DialogDetailProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetailProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetailProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
