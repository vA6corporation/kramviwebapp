import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSearchPatientsComponent } from './dialog-search-patients.component';

describe('DialogSearchPatientsComponent', () => {
  let component: DialogSearchPatientsComponent;
  let fixture: ComponentFixture<DialogSearchPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSearchPatientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSearchPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
