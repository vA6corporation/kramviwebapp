import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelectLotsComponent } from './dialog-select-lots.component';

describe('DialogSelectLotsComponent', () => {
  let component: DialogSelectLotsComponent;
  let fixture: ComponentFixture<DialogSelectLotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSelectLotsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSelectLotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
