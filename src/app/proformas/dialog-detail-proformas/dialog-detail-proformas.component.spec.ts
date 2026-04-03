import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailProformasComponent } from './dialog-detail-proformas.component';

describe('DialogDetailProformasComponent', () => {
  let component: DialogDetailProformasComponent;
  let fixture: ComponentFixture<DialogDetailProformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetailProformasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetailProformasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
