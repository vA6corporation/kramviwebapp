import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPurchasesComponent } from './detail-purchases.component';

describe('DetailPurchasesComponent', () => {
  let component: DetailPurchasesComponent;
  let fixture: ComponentFixture<DetailPurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPurchasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
