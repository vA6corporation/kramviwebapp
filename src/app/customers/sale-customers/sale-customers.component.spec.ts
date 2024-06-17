import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleCustomersComponent } from './sale-customers.component';

describe('SaleCustomersComponent', () => {
  let component: SaleCustomersComponent;
  let fixture: ComponentFixture<SaleCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleCustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
