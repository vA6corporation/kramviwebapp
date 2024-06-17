import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLotsComponent } from './edit-lots.component';

describe('EditLotsComponent', () => {
  let component: EditLotsComponent;
  let fixture: ComponentFixture<EditLotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLotsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditLotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
