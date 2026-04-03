import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedCustomersComponent } from './deleted-customers.component';

describe('DeletedCustomersComponent', () => {
  let component: DeletedCustomersComponent;
  let fixture: ComponentFixture<DeletedCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletedCustomersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletedCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
