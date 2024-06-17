import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosReceptionComponent } from './pos-reception.component';

describe('PosReceptionComponent', () => {
  let component: PosReceptionComponent;
  let fixture: ComponentFixture<PosReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosReceptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
