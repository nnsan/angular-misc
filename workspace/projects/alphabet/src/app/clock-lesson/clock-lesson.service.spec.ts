import { TestBed } from '@angular/core/testing';

import { ClockLessonService } from './clock-lesson.service';

describe('ClockLessonService', () => {
  let service: ClockLessonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClockLessonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
