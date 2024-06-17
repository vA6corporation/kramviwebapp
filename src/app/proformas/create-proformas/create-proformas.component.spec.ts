import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProformasComponent } from './create-proformas.component';

describe('CreateProformasComponent', () => {
  let component: CreateProformasComponent;
  let fixture: ComponentFixture<CreateProformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProformasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProformasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
