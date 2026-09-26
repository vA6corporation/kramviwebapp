import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOutStockComponent } from './dialog-out-stock.component';

describe('DialogOutStockComponent', () => {
  let component: DialogOutStockComponent;
  let fixture: ComponentFixture<DialogOutStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogOutStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOutStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
