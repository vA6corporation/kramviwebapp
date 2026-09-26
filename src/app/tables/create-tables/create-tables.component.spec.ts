import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTablesComponent } from './create-tables.component';

describe('CreateTablesComponent', () => {
  let component: CreateTablesComponent;
  let fixture: ComponentFixture<CreateTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTablesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
