import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCheckCdrsComponent } from './dialog-check-cdrs.component';

describe('DialogCheckCdrsComponent', () => {
  let component: DialogCheckCdrsComponent;
  let fixture: ComponentFixture<DialogCheckCdrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCheckCdrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCheckCdrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
