import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSuppliesComponent } from './create-supplies.component';

describe('CreateSuppliesComponent', () => {
  let component: CreateSuppliesComponent;
  let fixture: ComponentFixture<CreateSuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
