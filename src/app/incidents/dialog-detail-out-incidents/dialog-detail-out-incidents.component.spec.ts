import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailOutIncidentsComponent } from './dialog-detail-out-incidents.component';

describe('DialogDetailOutIncidentsComponent', () => {
  let component: DialogDetailOutIncidentsComponent;
  let fixture: ComponentFixture<DialogDetailOutIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDetailOutIncidentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDetailOutIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
