import { Injectable } from '@angular/core';
import { LessonService } from '../services/lesson.service';

@Injectable({
  providedIn: 'root'
})
export class VietnameseLetterService extends LessonService {
  override assetsDir = './assets/vietnamese-letter/';

  override questionDisplayFormat(lesson: string) {
    const [ uppercase, lowercase] = lesson.split('-');
    return lowercase ? `<span style="margin-right: 0.15em">${uppercase}</span><span style="font-size: 70%">${lowercase}</span>` : `<span>${uppercase}</span>`;
  }
}
