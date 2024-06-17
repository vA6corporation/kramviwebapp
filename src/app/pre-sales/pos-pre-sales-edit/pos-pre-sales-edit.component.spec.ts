import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosPreSalesEditComponent } from './pos-pre-sales-edit.component';

describe('PosPreSalesEditComponent', () => {
  let component: PosPreSalesEditComponent;
  let fixture: ComponentFixture<PosPreSalesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosPreSalesEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosPreSalesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
