import { Injectable } from '@angular/core';
import { ILessonQuestion, LessonService } from '../services/lesson.service';

@Injectable({
  providedIn: 'root'
})
export class ClockLessonService extends LessonService {
  override assetsDir = './assets/clock';

  override readAnswer(item: ILessonQuestion): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(_ => {
        resolve();
      }, 1_000);
    });
  }

  override readQuestion(): Promise<void> {
    return new Promise<void>((resolve) => {
      const question = new Audio(`${this.assetsDir}/what-time-is-it.m4a`);
      question.play().catch(err => {
        console.log(err);
      });

      setTimeout(_ => {
        resolve();
      }, 2_000);
    });
  }

  generateQuestionList(count: number): ILessonQuestion[] {
    return this.generateUniqueRandomTimes(count).map(item => ({answer: '', lessonUnit: item, question: ''}));
  }

  generateRandomTime(): string {
    const hours = Math.floor(Math.random() * 12);
    const minutes = Math.floor(Math.random() * 12) * 5;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  generateUniqueRandomTimes(count: number): string[] {
    const uniqueTimes = new Set<string>();

    while (uniqueTimes.size < count) {
      const time = this.generateRandomTime();
      uniqueTimes.add(time);
    }

    return Array.from(uniqueTimes);
  }

  parseMessage(time: string): {hours: number, minutes: number} {
    const [hours, minutes] = time.split(':');

    return {
      hours: parseInt(hours),
      minutes: parseInt(minutes)
    }
  }
}
