import { TestBed } from '@angular/core/testing';

import { PhonticsService } from './phontics.service';

describe('PhonticsService', () => {
  let service: PhonticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhonticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
