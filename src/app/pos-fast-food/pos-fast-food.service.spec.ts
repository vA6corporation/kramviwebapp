import { TestBed } from '@angular/core/testing';

import { PosFastFoodService } from './pos-fast-food.service';

describe('PosFastFoodService', () => {
  let service: PosFastFoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosFastFoodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
