import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckStockComponent } from './check-stock.component';

describe('CheckStockComponent', () => {
  let component: CheckStockComponent;
  let fixture: ComponentFixture<CheckStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
