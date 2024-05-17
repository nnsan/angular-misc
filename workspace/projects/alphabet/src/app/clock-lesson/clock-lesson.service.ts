import { Injectable } from '@angular/core';
import { LessonService } from '../services/lesson.service';

@Injectable({
  providedIn: 'root'
})
export class ClockLessonService extends LessonService {
  override assetsDir = './assets/vietnamese-letter/';
}
