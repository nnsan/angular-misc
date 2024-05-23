import { Injectable } from '@angular/core';
import { LessonService } from '../services/lesson.service';

@Injectable({
  providedIn: 'root'
})
export class PhonticsService extends LessonService {
  override assetsDir = './assets/phonetics';

  override questionDisplayFormat(lesson: string) {
    const [ uppercase, lowercase] = lesson.split('-');
    return lowercase ? `<span style="margin-right: 0.15em">${uppercase}</span><span> - </span><span style="font-size: 70%">${lowercase}</span>` : `<span>${uppercase}</span>`;
  }

  override async generateQuestion() {
    this.currentQuestion = this.getLetter();
    this.subject.next({unit: this.currentQuestion.lessonUnit, format: this.questionDisplayFormat(this.currentQuestion.lessonUnit), image: this.currentQuestion.image});
  }
}
