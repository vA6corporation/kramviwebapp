import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosStandardComponent } from './pos-standard.component';

describe('PosStandarComponent', () => {
  let component: PosStandardComponent;
  let fixture: ComponentFixture<PosStandardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosStandardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
