import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreSalesComponent } from './pre-sales.component';

describe('PreSalesComponent', () => {
  let component: PreSalesComponent;
  let fixture: ComponentFixture<PreSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreSalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
