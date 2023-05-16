import { TestBed } from '@angular/core/testing';

import { PageTreeServiceService } from './page-tree-service.service';

describe('PageTreeServiceService', () => {
  let service: PageTreeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageTreeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
