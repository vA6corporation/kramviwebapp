import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeBoardsComponent } from './charge-boards.component';

describe('ChargeBoardsComponent', () => {
  let component: ChargeBoardsComponent;
  let fixture: ComponentFixture<ChargeBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeBoardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
