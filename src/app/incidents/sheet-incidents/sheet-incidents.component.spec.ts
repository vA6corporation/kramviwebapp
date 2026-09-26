import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetIncidentsComponent } from './sheet-incidents.component';

describe('SheetIncidentsComponent', () => {
  let component: SheetIncidentsComponent;
  let fixture: ComponentFixture<SheetIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetIncidentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
