import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyProformasComponent } from './copy-proformas.component';

describe('CopyProformasComponent', () => {
  let component: CopyProformasComponent;
  let fixture: ComponentFixture<CopyProformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyProformasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyProformasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
