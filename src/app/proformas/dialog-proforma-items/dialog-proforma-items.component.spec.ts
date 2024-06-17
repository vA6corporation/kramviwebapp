import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProformaItemsComponent } from './dialog-proforma-items.component';

describe('DialogProformaItemsComponent', () => {
  let component: DialogProformaItemsComponent;
  let fixture: ComponentFixture<DialogProformaItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogProformaItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogProformaItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
