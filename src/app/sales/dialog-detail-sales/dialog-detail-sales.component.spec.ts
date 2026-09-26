import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailSalesComponent } from './dialog-detail-sales.component';

describe('DialogDetailSalesComponent', () => {
  let component: DialogDetailSalesComponent;
  let fixture: ComponentFixture<DialogDetailSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetailSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetailSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
