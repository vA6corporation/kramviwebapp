import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBanksComponent } from './create-banks.component';

describe('CreateBanksComponent', () => {
  let component: CreateBanksComponent;
  let fixture: ComponentFixture<CreateBanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBanksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
