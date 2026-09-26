import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutIncidentsComponent } from './out-incidents.component';

describe('OutIncidentsComponent', () => {
  let component: OutIncidentsComponent;
  let fixture: ComponentFixture<OutIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutIncidentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
