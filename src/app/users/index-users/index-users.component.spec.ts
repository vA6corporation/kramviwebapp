import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexUsersComponent } from './index-users.component';

describe('IndexUsersComponent', () => {
  let component: IndexUsersComponent;
  let fixture: ComponentFixture<IndexUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
