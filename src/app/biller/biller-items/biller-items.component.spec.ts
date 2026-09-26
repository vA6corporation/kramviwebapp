import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillerItemsComponent } from './biller-items.component';

describe('BillerItemsComponent', () => {
  let component: BillerItemsComponent;
  let fixture: ComponentFixture<BillerItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillerItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillerItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
