import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeCreditComponent } from './charge-credit.component';

describe('ChargeCreditComponent', () => {
  let component: ChargeCreditComponent;
  let fixture: ComponentFixture<ChargeCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeCreditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
