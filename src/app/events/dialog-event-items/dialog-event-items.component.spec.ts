import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEventItemsComponent } from './dialog-event-items.component';

describe('DialogEventItemsComponent', () => {
  let component: DialogEventItemsComponent;
  let fixture: ComponentFixture<DialogEventItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEventItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEventItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
