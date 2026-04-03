import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateTurnsComponent } from './dialog-create-turns.component';

describe('DialogCreateTurnsComponent', () => {
  let component: DialogCreateTurnsComponent;
  let fixture: ComponentFixture<DialogCreateTurnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCreateTurnsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCreateTurnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
