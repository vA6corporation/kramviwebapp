import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProvidersComponent } from './create-providers.component';

describe('CreateProvidersComponent', () => {
  let component: CreateProvidersComponent;
  let fixture: ComponentFixture<CreateProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProvidersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
