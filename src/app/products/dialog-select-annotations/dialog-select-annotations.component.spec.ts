import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelectAnnotationsComponent } from './dialog-select-annotations.component';

describe('DialogSelectAnnotationsComponent', () => {
  let component: DialogSelectAnnotationsComponent;
  let fixture: ComponentFixture<DialogSelectAnnotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSelectAnnotationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSelectAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
