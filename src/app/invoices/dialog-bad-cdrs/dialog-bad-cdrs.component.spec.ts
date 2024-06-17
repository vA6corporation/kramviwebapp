import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBadCdrsComponent } from './dialog-bad-cdrs.component';

describe('DialogBadCdrsComponent', () => {
  let component: DialogBadCdrsComponent;
  let fixture: ComponentFixture<DialogBadCdrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogBadCdrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBadCdrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
