import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditPriceListsComponent } from './dialog-edit-price-lists.component';

describe('DialogEditPriceListsComponent', () => {
  let component: DialogEditPriceListsComponent;
  let fixture: ComponentFixture<DialogEditPriceListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditPriceListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditPriceListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
