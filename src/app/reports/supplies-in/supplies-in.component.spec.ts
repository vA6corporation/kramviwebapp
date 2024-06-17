import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliesInComponent } from './supplies-in.component';

describe('SuppliesInComponent', () => {
  let component: SuppliesInComponent;
  let fixture: ComponentFixture<SuppliesInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliesInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliesInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
