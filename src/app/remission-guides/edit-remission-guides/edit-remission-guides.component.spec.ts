import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRemissionGuidesComponent } from './edit-remission-guides.component';

describe('EditRemissionGuidesComponent', () => {
  let component: EditRemissionGuidesComponent;
  let fixture: ComponentFixture<EditRemissionGuidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRemissionGuidesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRemissionGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
