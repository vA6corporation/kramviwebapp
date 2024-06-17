import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformasComponent } from './proformas.component';

describe('ProformasComponent', () => {
  let component: ProformasComponent;
  let fixture: ComponentFixture<ProformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
