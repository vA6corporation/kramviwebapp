import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeTransfersComponent } from './charge-transfers.component';

describe('ChargeTransfersComponent', () => {
  let component: ChargeTransfersComponent;
  let fixture: ComponentFixture<ChargeTransfersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeTransfersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
