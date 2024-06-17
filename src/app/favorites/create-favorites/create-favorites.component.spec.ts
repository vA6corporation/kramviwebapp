import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFavoritesComponent } from './create-favorites.component';

describe('CreateFavoritesComponent', () => {
  let component: CreateFavoritesComponent;
  let fixture: ComponentFixture<CreateFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFavoritesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
