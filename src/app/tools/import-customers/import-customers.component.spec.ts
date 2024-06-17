import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCustomersComponent } from './import-customers.component';

describe('ImportCustomersComponent', () => {
  let component: ImportCustomersComponent;
  let fixture: ComponentFixture<ImportCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportCustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
