import { TestBed } from '@angular/core/testing';

import { AlphabetService } from './vietnamese-letter.service';

describe('VietnameseLetterService', () => {
  let service: AlphabetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphabetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
