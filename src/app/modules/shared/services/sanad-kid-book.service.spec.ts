import { TestBed } from '@angular/core/testing';

import { SanadKidBookService } from './sanad-kid-book.service';

describe('SanadKidBookService', () => {
  let service: SanadKidBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SanadKidBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
