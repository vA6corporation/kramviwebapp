import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePreSalesComponent } from './create-pre-sales.component';

describe('CreatePreSalesComponent', () => {
  let component: CreatePreSalesComponent;
  let fixture: ComponentFixture<CreatePreSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePreSalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePreSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
