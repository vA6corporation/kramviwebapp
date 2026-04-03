import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCreditsComponent } from './detail-credits.component';

describe('DetailCreditsComponent', () => {
  let component: DetailCreditsComponent;
  let fixture: ComponentFixture<DetailCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCreditsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
