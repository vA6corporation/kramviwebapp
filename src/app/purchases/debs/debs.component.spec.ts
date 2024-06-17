import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebsComponent } from './debs.component';

describe('DebsComponent', () => {
  let component: DebsComponent;
  let fixture: ComponentFixture<DebsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
