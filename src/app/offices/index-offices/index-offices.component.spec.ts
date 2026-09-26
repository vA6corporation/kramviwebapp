import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexOfficesComponent } from './index-offices.component';

describe('IndexOfficesComponent', () => {
  let component: IndexOfficesComponent;
  let fixture: ComponentFixture<IndexOfficesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexOfficesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexOfficesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
