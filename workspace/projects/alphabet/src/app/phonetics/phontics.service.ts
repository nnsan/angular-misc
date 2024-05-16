import { Injectable } from '@angular/core';
import { LessonService } from '../services/lesson.service';

@Injectable({
  providedIn: 'root'
})
export class PhonticsService extends LessonService {
  override assetsDir = './assets/phonetics/';
}
