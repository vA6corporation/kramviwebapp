import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePricesComponent } from './update-prices.component';

describe('UpdatePricesComponent', () => {
  let component: UpdatePricesComponent;
  let fixture: ComponentFixture<UpdatePricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePricesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
