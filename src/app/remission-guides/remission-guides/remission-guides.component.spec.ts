import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemissionGuidesComponent } from './remission-guides.component';

describe('RemissionGuidesComponent', () => {
  let component: RemissionGuidesComponent;
  let fixture: ComponentFixture<RemissionGuidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemissionGuidesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemissionGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
