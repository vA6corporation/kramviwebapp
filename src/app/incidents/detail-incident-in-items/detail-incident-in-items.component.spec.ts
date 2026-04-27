import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailIncidentInItemsComponent } from './detail-incident-in-items.component';

describe('DetailIncidentInItemsComponent', () => {
  let component: DetailIncidentInItemsComponent;
  let fixture: ComponentFixture<DetailIncidentInItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailIncidentInItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailIncidentInItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
