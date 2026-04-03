import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeEditComponent } from './charge-edit.component';

describe('ChargeEditComponent', () => {
  let component: ChargeEditComponent;
  let fixture: ComponentFixture<ChargeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
