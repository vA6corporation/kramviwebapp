import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreatePurchaseComponent } from './dialog-create-purchase.component';

describe('DialogCreatePurchaseComponent', () => {
  let component: DialogCreatePurchaseComponent;
  let fixture: ComponentFixture<DialogCreatePurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCreatePurchaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCreatePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
