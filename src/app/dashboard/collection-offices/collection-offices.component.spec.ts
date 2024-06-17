import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionOfficesComponent } from './collection-offices.component';

describe('CollectionOfficesComponent', () => {
  let component: CollectionOfficesComponent;
  let fixture: ComponentFixture<CollectionOfficesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionOfficesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionOfficesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
