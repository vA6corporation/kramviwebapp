import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOutIncidentsComponent } from './create-out-incidents.component';

describe('CreateOutIncidentsComponent', () => {
  let component: CreateOutIncidentsComponent;
  let fixture: ComponentFixture<CreateOutIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOutIncidentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOutIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
