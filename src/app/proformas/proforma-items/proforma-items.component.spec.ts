import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaItemsComponent } from './proforma-items.component';

describe('ProformaItemsComponent', () => {
  let component: ProformaItemsComponent;
  let fixture: ComponentFixture<ProformaItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformaItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
