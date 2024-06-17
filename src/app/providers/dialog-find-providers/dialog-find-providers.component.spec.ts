import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFindProvidersComponent } from './dialog-find-providers.component';

describe('DialogFindProvidersComponent', () => {
  let component: DialogFindProvidersComponent;
  let fixture: ComponentFixture<DialogFindProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFindProvidersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFindProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
