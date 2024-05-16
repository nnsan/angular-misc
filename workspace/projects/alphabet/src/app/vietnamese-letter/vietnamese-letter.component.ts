import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { VietnameseLetterService } from './vietnamese-letter.service';
import { VIETNAMESE_LETTER_QUESTIONS } from './question';
import { CountdownTimerComponent } from '../countdown-timer/countdown-timer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ScoreTableComponent } from '../score-table/score-table.component';
import { END_SIGNAL, LessonStatus } from '../services/utility'
import { takeUntil, tap, throttleTime } from 'rxjs/operators';
import { SafeHtmlPipe } from './safe-html.pipe';
import { ILessonEmit } from '../services/lesson.service';

@Component({
  selector: 'app-vietnamese-letter',
  standalone: true,
  imports: [
    CountdownTimerComponent,
    ScoreTableComponent,
    MatButtonModule,
    MatDividerModule,
    SafeHtmlPipe
  ],
  templateUrl: './vietnamese-letter.component.html',
  styleUrl: './vietnamese-letter.component.scss'
})
export class VietnameseLetterComponent implements OnInit, OnDestroy {
  public thinkingTime: number;
  public resetTimer = new Subject<boolean>();

  public message: string;
  public displayMessage: string;
  public score: number;
  public question: number;
  public totalScore: number;
  public needMorePractice: Set<string>;

  public status: LessonStatus;
  public LESSON_STATUS = LessonStatus;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private lessonService: VietnameseLetterService) {
    this.thinkingTime = 3;
    this.score = 0;
    this.question = 0;
    this.totalScore = 0;
    this.message = '';
    this.displayMessage = '';
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
        if (value.lesson === END_SIGNAL) {
          this.message = '';
          this.displayMessage = '';
          this.status = LessonStatus.EndLesson;
        } else {
          this.status = LessonStatus.InProgress;
          this.displayMessage = value.format || '';
          this.message = value.lesson;
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
    event.stopPropagation();
    this.status = LessonStatus.OnPause;
    this.lessonService.pause();
  }

  onResume(event: MouseEvent) {
    event.stopPropagation();
    this.status = LessonStatus.InProgress;
    this.lessonService.resume();
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
