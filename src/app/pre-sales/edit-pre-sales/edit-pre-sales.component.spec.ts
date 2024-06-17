import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPreSalesComponent } from './edit-pre-sales.component';

describe('EditPreSalesComponent', () => {
  let component: EditPreSalesComponent;
  let fixture: ComponentFixture<EditPreSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPreSalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPreSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
