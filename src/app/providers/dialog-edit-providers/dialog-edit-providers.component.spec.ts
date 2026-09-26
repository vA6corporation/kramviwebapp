import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditProvidersComponent } from './dialog-edit-providers.component';

describe('DialogEditProvidersComponent', () => {
  let component: DialogEditProvidersComponent;
  let fixture: ComponentFixture<DialogEditProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditProvidersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
