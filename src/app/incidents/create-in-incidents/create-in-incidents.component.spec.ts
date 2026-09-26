import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInIncidentsComponent } from './create-in-incidents.component';

describe('CreateInIncidentsComponent', () => {
  let component: CreateInIncidentsComponent;
  let fixture: ComponentFixture<CreateInIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInIncidentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateInIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
