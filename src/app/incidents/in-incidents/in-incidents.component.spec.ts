import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InIncidentsComponent } from './in-incidents.component';

describe('InIncidentsComponent', () => {
  let component: InIncidentsComponent;
  let fixture: ComponentFixture<InIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InIncidentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
