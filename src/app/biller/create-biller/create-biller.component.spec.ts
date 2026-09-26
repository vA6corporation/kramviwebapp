import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBillerComponent } from './create-biller.component';

describe('CreateBillerComponent', () => {
  let component: CreateBillerComponent;
  let fixture: ComponentFixture<CreateBillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBillerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
