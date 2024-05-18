import { Injectable } from '@angular/core';
import { ILessonQuestion, LessonService } from '../services/lesson.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClockLessonService extends LessonService {
  override assetsDir = './assets/clock';
  simulationInterval: number | undefined = undefined;

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

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
  }

  startHourSimulation(subject: Subject<any>) {
    this.stopSimulation();
    let simulatedHours = 0;
    let simulatedMinutes = 0;
    let simulatedSeconds = 0;

    this.simulationInterval = setInterval(() => {
      simulatedSeconds++;
      if (simulatedSeconds === 60) {
        simulatedSeconds = 0;
        simulatedMinutes++;
      }
      if (simulatedMinutes === 60) {
        simulatedMinutes = 0;
        simulatedHours++;
      }

      if (simulatedHours === 12) {
        simulatedHours = 0; // Reset after 12 hours
      }

      subject.next({
        hours: simulatedHours,
        minutes: simulatedMinutes,
        seconds: simulatedSeconds
      });

      // Stop the simulation after one hour (60 minutes) if desired
      if (simulatedMinutes >= 60) {
        this.stopSimulation();
      }
    }, 1000 / 100); // Adjust interval time as needed for simulation speed
  }
}
