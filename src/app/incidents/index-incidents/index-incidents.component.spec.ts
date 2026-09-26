import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexIncidentsComponent } from './index-incidents.component';

describe('IndexIncidentsComponent', () => {
  let component: IndexIncidentsComponent;
  let fixture: ComponentFixture<IndexIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexIncidentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
