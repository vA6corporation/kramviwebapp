import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportStockComponent } from './import-stock.component';

describe('ImportStockComponent', () => {
  let component: ImportStockComponent;
  let fixture: ComponentFixture<ImportStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
