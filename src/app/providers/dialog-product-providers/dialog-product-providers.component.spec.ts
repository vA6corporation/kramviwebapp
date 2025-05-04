import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProductProvidersComponent } from './dialog-product-providers.component';

describe('DialogProductProvidersComponent', () => {
  let component: DialogProductProvidersComponent;
  let fixture: ComponentFixture<DialogProductProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogProductProvidersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogProductProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
