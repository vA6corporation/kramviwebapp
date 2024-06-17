import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailCustomersComponent } from './dialog-detail-customers.component';

describe('DialogDetailCustomersComponent', () => {
  let component: DialogDetailCustomersComponent;
  let fixture: ComponentFixture<DialogDetailCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDetailCustomersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDetailCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
