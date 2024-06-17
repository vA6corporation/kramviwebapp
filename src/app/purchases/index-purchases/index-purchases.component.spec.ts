import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexPurchasesComponent } from './index-purchases.component';

describe('IndexPurchasesComponent', () => {
  let component: IndexPurchasesComponent;
  let fixture: ComponentFixture<IndexPurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexPurchasesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
