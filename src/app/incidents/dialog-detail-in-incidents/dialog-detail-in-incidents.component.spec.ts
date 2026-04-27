import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailInIncidentsComponent } from './dialog-detail-in-incidents.component';

describe('DialogDetailInIncidentsComponent', () => {
  let component: DialogDetailInIncidentsComponent;
  let fixture: ComponentFixture<DialogDetailInIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDetailInIncidentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDetailInIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
