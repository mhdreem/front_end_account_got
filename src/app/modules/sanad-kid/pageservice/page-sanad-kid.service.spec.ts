import { TestBed } from '@angular/core/testing';

import { PageSanadKidService } from './page-sanad-kid.service';

describe('PageSanadKidService', () => {
  let service: PageSanadKidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageSanadKidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
