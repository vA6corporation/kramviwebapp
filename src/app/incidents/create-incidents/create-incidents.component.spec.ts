import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIncidentsComponent } from './create-incidents.component';

describe('CreateIncidentsComponent', () => {
  let component: CreateIncidentsComponent;
  let fixture: ComponentFixture<CreateIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateIncidentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
