import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailMovesComponent } from './dialog-detail-moves.component';

describe('DialogDetailMovesComponent', () => {
  let component: DialogDetailMovesComponent;
  let fixture: ComponentFixture<DialogDetailMovesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetailMovesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDetailMovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
