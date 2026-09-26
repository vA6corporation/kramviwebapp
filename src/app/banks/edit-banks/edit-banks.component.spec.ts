import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBanksComponent } from './edit-banks.component';

describe('EditBanksComponent', () => {
  let component: EditBanksComponent;
  let fixture: ComponentFixture<EditBanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBanksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
