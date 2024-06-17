import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteSaleComponent } from './dialog-delete-sale.component';

describe('DialogDeleteSaleComponent', () => {
  let component: DialogDeleteSaleComponent;
  let fixture: ComponentFixture<DialogDeleteSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDeleteSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
