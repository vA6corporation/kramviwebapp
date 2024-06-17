import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexMinimarketComponent } from './index-minimarket.component';

describe('IndexMinimarketComponent', () => {
  let component: IndexMinimarketComponent;
  let fixture: ComponentFixture<IndexMinimarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexMinimarketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexMinimarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
