import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailSuppliesComponent } from './dialog-detail-supplies.component';

describe('DialogDetailSuppliesComponent', () => {
  let component: DialogDetailSuppliesComponent;
  let fixture: ComponentFixture<DialogDetailSuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetailSuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetailSuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
