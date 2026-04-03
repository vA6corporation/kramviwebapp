import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopySalesComponent } from './copy-sales.component';

describe('CopySalesComponent', () => {
  let component: CopySalesComponent;
  let fixture: ComponentFixture<CopySalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopySalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopySalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
