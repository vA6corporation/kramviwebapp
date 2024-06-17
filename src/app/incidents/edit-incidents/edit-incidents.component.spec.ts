import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIncidentsComponent } from './edit-incidents.component';

describe('EditIncidentsComponent', () => {
  let component: EditIncidentsComponent;
  let fixture: ComponentFixture<EditIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIncidentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
