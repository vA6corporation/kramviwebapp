import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailPurchasesComponent } from './dialog-detail-purchases.component';

describe('DialogDetailPurchasesComponent', () => {
  let component: DialogDetailPurchasesComponent;
  let fixture: ComponentFixture<DialogDetailPurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetailPurchasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetailPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
