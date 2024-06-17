import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeEditRemissionGuidesComponent } from './charge-edit-remission-guides.component';

describe('ChargeEditRemissionGuidesComponent', () => {
  let component: ChargeEditRemissionGuidesComponent;
  let fixture: ComponentFixture<ChargeEditRemissionGuidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeEditRemissionGuidesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeEditRemissionGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
