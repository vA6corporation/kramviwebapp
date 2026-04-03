import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOfficesComponent } from './edit-offices.component';

describe('EditOfficesComponent', () => {
  let component: EditOfficesComponent;
  let fixture: ComponentFixture<EditOfficesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOfficesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOfficesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
