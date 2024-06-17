import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosStandardEditComponent } from './pos-standard-edit.component';

describe('PosStandardEditComponent', () => {
  let component: PosStandardEditComponent;
  let fixture: ComponentFixture<PosStandardEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosStandardEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosStandardEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
