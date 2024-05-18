import { Component, OnDestroy, OnInit } from '@angular/core';
import { CountdownTimerComponent } from '../countdown-timer/countdown-timer.component';
import { ScoreTableComponent } from '../score-table/score-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { END_SIGNAL, LessonStatus } from '../services/utility';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ILessonEmit } from '../services/lesson.service';
import { ClockLessonService } from './clock-lesson.service'
import { AnalogClockComponent } from '../analog-clock/analog-clock.component';

@Component({
  selector: 'app-clock-lesson',
  standalone: true,
  imports: [
    CountdownTimerComponent,
    ScoreTableComponent,
    MatButtonModule,
    MatDividerModule,
    AnalogClockComponent
  ],
  templateUrl: './clock-lesson.component.html',
  styleUrl: './clock-lesson.component.scss'
})
export class ClockLessonComponent implements OnInit, OnDestroy {
  public thinkingTime: number;
  public resetTimer = new Subject<boolean>();

  public message: string;
  public score: number;
  public question: number;
  public totalScore: number;
  public needMorePractice: Set<string>;

  public status: LessonStatus;
  public LESSON_STATUS = LessonStatus;

  public hours: number;
  public minutes: number;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private lessonService: ClockLessonService) {
    this.thinkingTime = 3;
    this.score = 0;
    this.question = 0;
    this.totalScore = 0;
    this.message = '';
    this.hours = 0;
    this.minutes = 0;
    this.needMorePractice = new Set();
    this.status = LessonStatus.ReadyToStart;
  }

  ngOnInit(): void {
    this.totalScore = 10;
  }

  onTimesUp() {
    this.lessonService.nextQuestion();
  }

  onStart(event: MouseEvent) {
    event.stopPropagation();
    this.score = 0;
    this.question = 0;
    this.needMorePractice.clear();
    this.lessonService.setQuestionList(this.lessonService.generateQuestionList(this.totalScore));
    this.lessonService.start();

    this.lessonService.notify.pipe(
      takeUntil(this.destroy$),
      tap((value: ILessonEmit) => {
        if (value.unit === END_SIGNAL) {
          this.message = '';
          this.status = LessonStatus.EndLesson;
        } else {
          this.status = LessonStatus.InProgress;
          this.message = value.unit;
          const time = this.lessonService.parseMessage(this.message);
          this.hours = time.hours;
          this.minutes = time.minutes;
          this.needMorePractice.add(this.message);
          this.question += 1;
        }
      }),
    ).subscribe(async _ => {
      if (this.message) {
        await this.lessonService.readQuestion();
        this.resetTimer.next(true);
      }
    });
  }

  OnContinue(event: MouseEvent) {
    event.stopPropagation();
    this.lessonService.setQuestionList(this.lessonService.generateQuestionList(this.totalScore));
    this.score = 0;
    this.question = 0;
    this.needMorePractice.clear();

    this.lessonService.start();
  }

  onPause(event: MouseEvent) {
    this.status = LessonStatus.OnPause;
    this.lessonService.pause();
    event.stopPropagation();
  }

  onResume(event: MouseEvent) {
    this.status = LessonStatus.InProgress;
    this.lessonService.resume();
    event.stopPropagation();
  }

  getScore() {
    if (this.needMorePractice.has(this.message)) {
      this.needMorePractice.delete(this.message);
      this.score += 1;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.lessonService.stop();
  }
}
