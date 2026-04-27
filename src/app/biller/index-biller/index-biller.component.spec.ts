import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexBillerComponent } from './index-biller.component';

describe('IndexBillerComponent', () => {
  let component: IndexBillerComponent;
  let fixture: ComponentFixture<IndexBillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexBillerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexBillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
