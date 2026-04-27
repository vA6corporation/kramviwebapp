import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailIncidentOutItemsComponent } from './detail-incident-out-items.component';

describe('DetailIncidentOutItemsComponent', () => {
  let component: DetailIncidentOutItemsComponent;
  let fixture: ComponentFixture<DetailIncidentOutItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailIncidentOutItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailIncidentOutItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
