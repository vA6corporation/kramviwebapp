import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGeneralsComponent } from './create-generals.component';

describe('CreateGeneralsComponent', () => {
  let component: CreateGeneralsComponent;
  let fixture: ComponentFixture<CreateGeneralsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGeneralsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGeneralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
