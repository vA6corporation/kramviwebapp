import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexKitchenComponent } from './index-kitchen.component';

describe('IndexKitchenComponent', () => {
  let component: IndexKitchenComponent;
  let fixture: ComponentFixture<IndexKitchenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexKitchenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexKitchenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
