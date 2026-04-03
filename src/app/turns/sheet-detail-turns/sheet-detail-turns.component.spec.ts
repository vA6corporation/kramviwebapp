import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetDetailTurnsComponent } from './sheet-detail-turns.component';

describe('SheetDetailTurnsComponent', () => {
  let component: SheetDetailTurnsComponent;
  let fixture: ComponentFixture<SheetDetailTurnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetDetailTurnsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SheetDetailTurnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
