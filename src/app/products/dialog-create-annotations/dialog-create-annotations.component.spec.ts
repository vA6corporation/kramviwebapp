import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateAnnotationsComponent } from './dialog-create-annotations.component';

describe('DialogCreateAnnotationsComponent', () => {
  let component: DialogCreateAnnotationsComponent;
  let fixture: ComponentFixture<DialogCreateAnnotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCreateAnnotationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCreateAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
