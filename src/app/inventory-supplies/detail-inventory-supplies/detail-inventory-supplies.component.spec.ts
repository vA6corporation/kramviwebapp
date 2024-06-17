import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInventorySuppliesComponent } from './detail-inventory-supplies.component';

describe('DetailInventorySuppliesComponent', () => {
  let component: DetailInventorySuppliesComponent;
  let fixture: ComponentFixture<DetailInventorySuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailInventorySuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailInventorySuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
