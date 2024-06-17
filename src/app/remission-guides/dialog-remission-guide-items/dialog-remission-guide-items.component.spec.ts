import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRemissionGuideItemsComponent } from './dialog-remission-guide-items.component';

describe('DialogRemissionGuideItemsComponent', () => {
  let component: DialogRemissionGuideItemsComponent;
  let fixture: ComponentFixture<DialogRemissionGuideItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRemissionGuideItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRemissionGuideItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
