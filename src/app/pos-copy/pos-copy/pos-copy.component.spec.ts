import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCopyComponent } from './pos-copy.component';

describe('PosCopyComponent', () => {
  let component: PosCopyComponent;
  let fixture: ComponentFixture<PosCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosCopyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
