import { TestBed } from '@angular/core/testing';

import { VietnameseLetterService } from './vietnamese-letter.service';

describe('VietnameseLetterService', () => {
  let service: VietnameseLetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VietnameseLetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
