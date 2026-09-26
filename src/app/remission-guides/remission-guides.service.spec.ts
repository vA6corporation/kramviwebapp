import { TestBed } from '@angular/core/testing';

import { RemissionGuidesService } from './remission-guides.service';

describe('RemissionGuidesService', () => {
  let service: RemissionGuidesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemissionGuidesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
