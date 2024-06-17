import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginWaiterComponent } from './login-waiter.component';

describe('LoginWaiterComponent', () => {
  let component: LoginWaiterComponent;
  let fixture: ComponentFixture<LoginWaiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginWaiterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginWaiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
