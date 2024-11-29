import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetractionComponent } from './dialog-detraction.component';

describe('DialogDetractionComponent', () => {
  let component: DialogDetractionComponent;
  let fixture: ComponentFixture<DialogDetractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDetractionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDetractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
