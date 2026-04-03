import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetOfficeComponent } from './set-office.component';

describe('SetOfficeComponent', () => {
  let component: SetOfficeComponent;
  let fixture: ComponentFixture<SetOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
