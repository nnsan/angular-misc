import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { LessonService } from '../services/lesson.service';
import { VIETNAMESE_LETTER_QUESTIONS } from './question';
import { CountdownTimerComponent } from '../countdown-timer/countdown-timer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ScoreTableComponent } from '../score-table/score-table.component';
import { END_SIGNAL, LessonStatus } from '../services/utility'
import { takeUntil, tap, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-vietnamese-letter',
  standalone: true,
  imports: [
    CountdownTimerComponent,
    ScoreTableComponent,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './vietnamese-letter.component.html',
  styleUrl: './vietnamese-letter.component.scss'
})
export class VietnameseLetterComponent implements OnInit, OnDestroy {
  public thinkingTime: number;
  public resetTimer = new Subject<boolean>();

  public message: string;
  public score: number;
  public question: number;
  public totalScore: number;
  public needMorePractice: string[];

  public status: LessonStatus;
  public LESSON_STATUS = LessonStatus;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private lessonService: LessonService) {
    this.thinkingTime = 7;
    this.score = 0;
    this.question = 0;
    this.totalScore = 0;
    this.message = '';
    this.needMorePractice = [];
    this.status = LessonStatus.ReadyToStart;
  }

  ngOnInit(): void {
    this.lessonService.setQuestionList(VIETNAMESE_LETTER_QUESTIONS);
    this.totalScore = VIETNAMESE_LETTER_QUESTIONS.length;
  }

  onTimesUp() {
    this.lessonService.nextQuestion();
  }

  onStart() {
    this.score = 0;
    this.question = 0;
    this.lessonService.start();

    this.lessonService.notify.pipe(
      takeUntil(this.destroy$),
      tap((value: string) => {
        if (value === END_SIGNAL) {
          this.message = '';
          this.status = LessonStatus.EndLesson;
        } else {
          this.status = LessonStatus.InProgress;
          this.message = value;
          this.needMorePractice.push(value);
          this.question += 1;
        }
      }),
      throttleTime(4_000)
    ).subscribe((value: string) => {
      if (this.message) {
        this.resetTimer.next(true);
      }
    });
  }

  onPause() {
    this.status = LessonStatus.OnPause;
    this.lessonService.pause();
  }

  onResume() {
    this.status = LessonStatus.InProgress;
    this.lessonService.resume();
  }

  onResult() {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
