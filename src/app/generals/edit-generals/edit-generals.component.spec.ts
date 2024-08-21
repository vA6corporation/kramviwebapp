import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGeneralsComponent } from './edit-generals.component';

describe('EditGeneralsComponent', () => {
  let component: EditGeneralsComponent;
  let fixture: ComponentFixture<EditGeneralsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGeneralsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGeneralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
