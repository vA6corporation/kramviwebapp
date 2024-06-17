import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAnnotationsComponent } from './dialog-annotations.component';

describe('DialogAnnotationsComponent', () => {
  let component: DialogAnnotationsComponent;
  let fixture: ComponentFixture<DialogAnnotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAnnotationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
