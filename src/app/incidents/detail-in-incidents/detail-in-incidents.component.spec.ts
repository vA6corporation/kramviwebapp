import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInIncidentsComponent } from './detail-in-incidents.component';

describe('DetailInIncidentsComponent', () => {
  let component: DetailInIncidentsComponent;
  let fixture: ComponentFixture<DetailInIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailInIncidentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailInIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
