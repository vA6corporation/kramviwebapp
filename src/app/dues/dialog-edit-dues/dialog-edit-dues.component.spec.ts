import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditDuesComponent } from './dialog-edit-dues.component';

describe('DialogEditDuesComponent', () => {
  let component: DialogEditDuesComponent;
  let fixture: ComponentFixture<DialogEditDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditDuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
