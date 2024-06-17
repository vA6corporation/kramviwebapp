import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeCopyComponent } from './charge-copy.component';

describe('ChargeCopyComponent', () => {
  let component: ChargeCopyComponent;
  let fixture: ComponentFixture<ChargeCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeCopyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
