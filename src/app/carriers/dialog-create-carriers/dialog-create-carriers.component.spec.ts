import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateCarriersComponent } from './dialog-create-carriers.component';

describe('DialogCreateCarriersComponent', () => {
  let component: DialogCreateCarriersComponent;
  let fixture: ComponentFixture<DialogCreateCarriersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreateCarriersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateCarriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
