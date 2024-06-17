import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMoveItemsComponent } from './dialog-move-items.component';

describe('DialogMoveItemsComponent', () => {
  let component: DialogMoveItemsComponent;
  let fixture: ComponentFixture<DialogMoveItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMoveItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogMoveItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
