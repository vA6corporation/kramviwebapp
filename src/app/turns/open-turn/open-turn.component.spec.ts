import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenTurnComponent } from './open-turn.component';

describe('OpenTurnComponent', () => {
  let component: OpenTurnComponent;
  let fixture: ComponentFixture<OpenTurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenTurnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
