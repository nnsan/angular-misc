import { Component, OnDestroy, OnInit } from '@angular/core';
import { CountdownTimerComponent } from '../countdown-timer/countdown-timer.component';
import { ScoreTableComponent } from '../score-table/score-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { END_SIGNAL, LessonStatus } from '../services/utility';
import { VIETNAMESE_LETTER_QUESTIONS } from '../vietnamese-letter/question';
import { takeUntil, tap, throttleTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ILessonEmit } from '../services/lesson.service';
import { ClockLessonService } from './clock-lesson.service'

@Component({
  selector: 'app-clock-lesson',
  standalone: true,
  imports: [
    CountdownTimerComponent,
    ScoreTableComponent,
    MatButtonModule,
    MatDividerModule
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

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private lessonService: ClockLessonService) {
    this.thinkingTime = 3;
    this.score = 0;
    this.question = 0;
    this.totalScore = 0;
    this.message = '';
    this.needMorePractice = new Set();
    this.status = LessonStatus.ReadyToStart;
  }

  ngOnInit(): void {
    this.lessonService.setQuestionList(VIETNAMESE_LETTER_QUESTIONS);
    this.totalScore = VIETNAMESE_LETTER_QUESTIONS.length;
  }

  onTimesUp() {
    this.lessonService.nextQuestion();
  }

  onStart(event: MouseEvent) {
    event.stopPropagation();
    this.score = 0;
    this.question = 0;
    this.needMorePractice.clear();
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
          this.needMorePractice.add(this.message);
          this.question += 1;
        }
      }),
      throttleTime(4_000)
    ).subscribe(_ => {
      if (this.message) {
        this.resetTimer.next(true);
      }
    });
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
  }
}
