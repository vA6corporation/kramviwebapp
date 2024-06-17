import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailIncidentsComponent } from './dialog-detail-incidents.component';

describe('DialogDetailIncidentsComponent', () => {
  let component: DialogDetailIncidentsComponent;
  let fixture: ComponentFixture<DialogDetailIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetailIncidentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDetailIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
