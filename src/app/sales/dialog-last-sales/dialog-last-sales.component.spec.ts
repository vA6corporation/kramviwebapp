import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLastSalesComponent } from './dialog-last-sales.component';

describe('DialogLastSalesComponent', () => {
  let component: DialogLastSalesComponent;
  let fixture: ComponentFixture<DialogLastSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLastSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLastSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
