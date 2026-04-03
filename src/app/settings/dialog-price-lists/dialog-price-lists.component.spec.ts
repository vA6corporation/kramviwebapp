import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPriceListsComponent } from './dialog-price-lists.component';

describe('DialogPriceListsComponent', () => {
  let component: DialogPriceListsComponent;
  let fixture: ComponentFixture<DialogPriceListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPriceListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPriceListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
