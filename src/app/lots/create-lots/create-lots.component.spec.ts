import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLotsComponent } from './create-lots.component';

describe('CreateLotsComponent', () => {
  let component: CreateLotsComponent;
  let fixture: ComponentFixture<CreateLotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLotsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateLotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
