import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailOutIncidentsComponent } from './detail-out-incidents.component';

describe('DetailOutIncidentsComponent', () => {
  let component: DetailOutIncidentsComponent;
  let fixture: ComponentFixture<DetailOutIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailOutIncidentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailOutIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
