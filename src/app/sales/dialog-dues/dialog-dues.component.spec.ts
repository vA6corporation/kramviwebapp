import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDuesComponent } from './dialog-dues.component';

describe('DialogDuesComponent', () => {
  let component: DialogDuesComponent;
  let fixture: ComponentFixture<DialogDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
