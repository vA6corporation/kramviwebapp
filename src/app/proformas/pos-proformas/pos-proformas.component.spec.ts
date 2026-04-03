import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosProformasComponent } from './pos-proformas.component';

describe('PosProformasComponent', () => {
  let component: PosProformasComponent;
  let fixture: ComponentFixture<PosProformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosProformasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosProformasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
