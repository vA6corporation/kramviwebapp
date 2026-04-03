import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTurnsComponent } from './detail-turns.component';

describe('DetailTurnsComponent', () => {
  let component: DetailTurnsComponent;
  let fixture: ComponentFixture<DetailTurnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailTurnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTurnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
