import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateLotsComponent } from './dialog-create-lots.component';

describe('DialogCreateLotsComponent', () => {
  let component: DialogCreateLotsComponent;
  let fixture: ComponentFixture<DialogCreateLotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCreateLotsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogCreateLotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
