import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetRemissionGuidesComponent } from './sheet-remission-guides.component';

describe('SheetRemissionGuidesComponent', () => {
  let component: SheetRemissionGuidesComponent;
  let fixture: ComponentFixture<SheetRemissionGuidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetRemissionGuidesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetRemissionGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
