import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTransfersComponent } from './edit-transfers.component';

describe('EditTransfersComponent', () => {
  let component: EditTransfersComponent;
  let fixture: ComponentFixture<EditTransfersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTransfersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
