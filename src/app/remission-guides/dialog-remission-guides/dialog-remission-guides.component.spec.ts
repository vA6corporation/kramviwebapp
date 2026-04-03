import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRemissionGuidesComponent } from './dialog-remission-guides.component';

describe('DialogRemissionGuidesComponent', () => {
  let component: DialogRemissionGuidesComponent;
  let fixture: ComponentFixture<DialogRemissionGuidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRemissionGuidesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRemissionGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
