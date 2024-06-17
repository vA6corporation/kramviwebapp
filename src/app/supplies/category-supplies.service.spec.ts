import { TestBed } from '@angular/core/testing';

import { CategorySuppliesService } from './category-supplies.service';

describe('CategorySuppliesService', () => {
  let service: CategorySuppliesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorySuppliesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
