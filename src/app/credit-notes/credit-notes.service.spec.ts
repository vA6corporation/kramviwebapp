import { TestBed } from '@angular/core/testing';

import { CreditNotesService } from './credit-notes.service';

describe('CreditNotesService', () => {
  let service: CreditNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
