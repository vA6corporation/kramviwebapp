import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeletedComponent } from './dialog-deleted.component';

describe('DialogDeletedComponent', () => {
  let component: DialogDeletedComponent;
  let fixture: ComponentFixture<DialogDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDeletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
