import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailRemissionGuidesComponent } from './dialog-detail-remission-guides.component';

describe('DialogDetailRemissionGuidesComponent', () => {
  let component: DialogDetailRemissionGuidesComponent;
  let fixture: ComponentFixture<DialogDetailRemissionGuidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetailRemissionGuidesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDetailRemissionGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
