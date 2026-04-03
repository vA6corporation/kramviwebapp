import { TestBed } from '@angular/core/testing';

import { ProformasService } from './proformas.service';

describe('ProformasService', () => {
  let service: ProformasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProformasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
