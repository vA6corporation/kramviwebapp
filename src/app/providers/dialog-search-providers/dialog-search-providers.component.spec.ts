import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSearchProvidersComponent } from './dialog-search-providers.component';

describe('DialogSearchProvidersComponent', () => {
  let component: DialogSearchProvidersComponent;
  let fixture: ComponentFixture<DialogSearchProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSearchProvidersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSearchProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
