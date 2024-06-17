import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliesOutComponent } from './supplies-out.component';

describe('SuppliesOutComponent', () => {
  let component: SuppliesOutComponent;
  let fixture: ComponentFixture<SuppliesOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliesOutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliesOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
