import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateProvidersComponent } from './dialog-create-providers.component';

describe('DialogCreateProvidersComponent', () => {
  let component: DialogCreateProvidersComponent;
  let fixture: ComponentFixture<DialogCreateProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreateProvidersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
