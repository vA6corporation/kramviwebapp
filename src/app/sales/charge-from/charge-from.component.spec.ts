import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeFromComponent } from './charge-from.component';

describe('ChargeFromComponent', () => {
  let component: ChargeFromComponent;
  let fixture: ComponentFixture<ChargeFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeFromComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
