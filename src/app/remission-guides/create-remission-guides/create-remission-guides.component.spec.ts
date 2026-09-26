import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRemissionGuidesComponent } from './create-remission-guides.component';

describe('CreateRemissionGuidesComponent', () => {
  let component: CreateRemissionGuidesComponent;
  let fixture: ComponentFixture<CreateRemissionGuidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRemissionGuidesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRemissionGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
