import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosPreSalesComponent } from './pos-pre-sales.component';

describe('PosPreSalesComponent', () => {
  let component: PosPreSalesComponent;
  let fixture: ComponentFixture<PosPreSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosPreSalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosPreSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
