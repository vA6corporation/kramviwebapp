import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexDashboardComponent } from './index-dashboard.component';

describe('IndexDashboardComponent', () => {
  let component: IndexDashboardComponent;
  let fixture: ComponentFixture<IndexDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
