import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabledOfficesComponent } from './disabled-offices.component';

describe('DisabledOfficesComponent', () => {
  let component: DisabledOfficesComponent;
  let fixture: ComponentFixture<DisabledOfficesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisabledOfficesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisabledOfficesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
