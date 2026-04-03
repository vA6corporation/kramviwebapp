import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditCarriersComponent } from './dialog-edit-carriers.component';

describe('DialogEditCarriersComponent', () => {
  let component: DialogEditCarriersComponent;
  let fixture: ComponentFixture<DialogEditCarriersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditCarriersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditCarriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
