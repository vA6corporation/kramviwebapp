import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseProvidersComponent } from './purchase-providers.component';

describe('PurchaseProvidersComponent', () => {
  let component: PurchaseProvidersComponent;
  let fixture: ComponentFixture<PurchaseProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseProvidersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
