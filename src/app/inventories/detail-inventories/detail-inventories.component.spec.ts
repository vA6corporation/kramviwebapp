import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInventoriesComponent } from './detail-inventories.component';

describe('DetailInventoriesComponent', () => {
  let component: DetailInventoriesComponent;
  let fixture: ComponentFixture<DetailInventoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailInventoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailInventoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
