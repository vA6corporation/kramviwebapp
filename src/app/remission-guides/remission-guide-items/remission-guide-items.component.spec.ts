import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemissionGuideItemsComponent } from './remission-guide-items.component';

describe('RemissionGuideItemsComponent', () => {
  let component: RemissionGuideItemsComponent;
  let fixture: ComponentFixture<RemissionGuideItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemissionGuideItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemissionGuideItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
