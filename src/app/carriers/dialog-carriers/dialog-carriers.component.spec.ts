import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCarriersComponent } from './dialog-carriers.component';

describe('DialogCarriersComponent', () => {
  let component: DialogCarriersComponent;
  let fixture: ComponentFixture<DialogCarriersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCarriersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCarriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
