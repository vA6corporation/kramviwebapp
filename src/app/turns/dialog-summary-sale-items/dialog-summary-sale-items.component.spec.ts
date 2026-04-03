import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSummarySaleItemsComponent } from './dialog-summary-sale-items.component';

describe('DialogSummarySaleItemsComponent', () => {
  let component: DialogSummarySaleItemsComponent;
  let fixture: ComponentFixture<DialogSummarySaleItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSummarySaleItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSummarySaleItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
